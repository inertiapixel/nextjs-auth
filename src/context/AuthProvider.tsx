'use client';

import { createContext, useState, useEffect, FC, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { parseToken } from '../utils/tokenUtils';
import {
  AuthContextType,
  AuthProviderProps,
  User,
  AuthResponse,
  LoginPayload,
  SocialProvider
} from '../types';
import {
  loginWithCredentials,
  loginWithOTP,
} from '../utils/auth';
import { SuspenseWrapper } from '../components/SuspenseWrapper';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children, config }) => {

  if (!config.apiBaseUrl) {
    throw new Error(
      '[nextjs-auth] Missing required "apiBaseUrl". Please set NEXT_PUBLIC_API_BASE_URI in your environment variables and pass it to AuthProvider.'
    );
  }

  const tokenKey = config?.tokenKey || 'token';
  
  const API_BASE_URL = config.apiBaseUrl;
  const loginEndpoint = config.apiEndpoints?.login || '/auth/login';
  const logoutEndpoint = config.apiEndpoints?.logout || '/auth/logout';

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<Record<string, unknown> | null>(null);

  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, [tokenKey]);

  const initializeAuth = () => {
    const token = getToken(tokenKey);
    if (token) {
      const decodedUser = parseToken(token);
      setUser(decodedUser);
      setIsAuthenticated(!!decodedUser);
    }
    setLoading(false);
  };

  const handleAuthSuccess = useCallback((response: AuthResponse) => {
    if (!response.accessToken) throw new Error('Access token missing in response.');

    const decodedUser = parseToken(response.accessToken);
    setToken(tokenKey, response.accessToken);
    setUser(decodedUser || response.user || null);
    setIsAuthenticated(true);
    config?.onLoginSuccess?.(decodedUser);

    const redirectUrl = localStorage.getItem('redirectTo') || '/';
    localStorage.removeItem('redirectTo');

    router.push(redirectUrl);
  }, [tokenKey, config, router]);

  const handleAuthFailure = useCallback((error: unknown) => {

    console.error('handleAuthFailure', error);

    setIsAuthenticated(false);
  
    if (
      typeof error === 'object' &&
      error !== null
    ) {
      setLoginError(error as Record<string, unknown>);
      config?.onLoginFail?.((error as { message: string }).message);
    } else {
      setLoginError({ message: 'Login failed' });
      config?.onLoginFail?.('Login failed');
    }
  }, [config]);

  

  const login = useCallback(async (credentials: LoginPayload): Promise<void> => {
    
    setLoginError(null);
    try {
      const response = await handleLoginMethod(credentials);
      handleAuthSuccess(response);
    } catch (error) {
      handleAuthFailure(error);
    }
  }, [handleAuthSuccess, handleAuthFailure]);

  const handleLoginMethod = async (credentials: LoginPayload): Promise<AuthResponse> => {
    const errors: Record<string, string> = {};
  
    if (credentials.provider === 'credentials') {
      if (!credentials.email) errors.email = 'Email is required.';
      if (!credentials.password) errors.password = 'Password is required.';
  
      if (Object.keys(errors).length > 0) {
        throw { type: 'validation', errors };
      }
  
      return await loginWithCredentials(`${API_BASE_URL}${loginEndpoint}`, credentials);
    }
  
    if (credentials.provider === 'otp') {
      if (!credentials.otp) errors.otp = 'OTP is required.';
  
      if (Object.keys(errors).length > 0) {
        throw { type: 'validation', errors };
      }
  
      return await loginWithOTP(`${API_BASE_URL}${loginEndpoint}`, credentials);
    }
  
    throw {
      type: 'invalid_method',
      message: 'Invalid login method.',
    };

  };
  

  const socialLogin = useCallback((provider: SocialProvider): Promise<void> => {
    return new Promise((resolve, reject: (reason: Error) => void) => {
      setLoginError(null);
      try {
        const { popup } = initializeSocialLoginPopup(provider, reject);
        setupPopupMonitoring(popup, provider, resolve, reject);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Social login initialization failed');
        reject(err);
      }
    });
  }, []);

  const initializeSocialLoginPopup = (
    provider: SocialProvider,
    reject: (reason: Error) => void
  ): { authUrl: string; popup: Window | null } => {
    const { authUrl } = getSocialLoginConfig(provider);

    const popup = window.open(
      authUrl,
      `${provider}AuthPopup`,
      'width=500,height=600,top=100,left=100'
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      const err = new Error('Popup blocked! Please allow popups for this site.');
      handleSocialLoginError(err, provider, reject);
      throw err;
    }

    return { authUrl, popup };
  };

  const getSocialLoginConfig = (provider: SocialProvider) => {
    const providerConfig = config.socialProviders?.find((p) => p.provider === provider);

    if (!providerConfig) {
      throw new Error(`Missing social provider config for ${provider}`);
    }

    const clientId = providerConfig.clientId;
    // const redirectUri = `${window.location.origin}/api/auth/${provider}?apiBaseUrl=${encodeURIComponent(API_BASE_URL)}`;
    const redirectUriNextJs = `${window.location.origin}/api/auth/${provider}`;
    // console.log('redirectUriredirectUri:::',redirectUriNextJs);
    const authUrl = buildOAuthUrl(provider, clientId, redirectUriNextJs);

    return { clientId, redirectUriNextJs, authUrl };
  };

  const buildOAuthUrl = (provider: SocialProvider, clientId: string, redirectUri: string): string => {
    const base = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
    }[provider];

    const scopeMap: Record<SocialProvider, string> = {
      google: 'profile email',
      facebook: 'email public_profile',
      linkedin: 'openid profile email',
    };

    const state = 'demo_state_123';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopeMap[provider],
      ...(provider === 'linkedin' && { state }),
      ...(provider === 'google' && { access_type: 'offline', prompt: 'consent' }),
    });

    return `${base}?${params.toString()}`;
  };

  const setupPopupMonitoring = (
    popup: Window | null,
    provider: SocialProvider,
    resolve: () => void,
    reject: (reason: Error) => void
  ) => {
    if (!popup) return;

    const popupCheckInterval = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupCheckInterval);
        const err = new Error('Authentication was cancelled');
        handleSocialLoginError(err, provider, reject);
      }
    }, 500);

    const messageHandler = (event: MessageEvent<AuthResponse>) => {
      if (event.origin !== window.location.origin) return;

      const payload = event.data;
      window.removeEventListener('message', messageHandler);
      clearInterval(popupCheckInterval);
      popup?.close();

      if (payload.isAuthenticated && payload.accessToken) {
        handleAuthSuccess(payload);
        resolve();
      } else {
        handleAuthFailure(payload);
      }
    };

    window.addEventListener('message', messageHandler);
  };

  const handleSocialLoginError = (
    error: Error,
    provider: SocialProvider,
    reject: (reason: Error) => void
  ) => {
    setLoginError({
      message: error.message,
      name: error.name,
      provider,
    });
  
    config?.onLoginFail?.(error.message);
    reject(error);
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      await performLogoutRequest();
    } catch (err) {
      console.error('Logout failed:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      cleanupAfterLogout();
    }
  }, [tokenKey, API_BASE_URL, logoutEndpoint, config, router]);

  const performLogoutRequest = async (): Promise<void> => {
    const token = getToken(tokenKey);
    if (token) {
      await fetch(`${API_BASE_URL}${logoutEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  const cleanupAfterLogout = (): void => {
    removeToken(tokenKey);
    setUser(null);
    setIsAuthenticated(false);
    config?.onLogout?.();

    const redirectUrl = config?.redirectAfterLogout || config?.redirectTo;
    if (redirectUrl) router.push(redirectUrl);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    loginError,
    socialLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <SuspenseWrapper>{children}</SuspenseWrapper>
    </AuthContext.Provider>
  );
};
