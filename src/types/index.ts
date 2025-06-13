import { ReactNode } from "react";

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  // Add more token fields here if needed
}

export interface User<T = unknown> {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  extra?: T;
}

export type LoginPayload =
  | {
      provider: 'credentials';
      email: string;
      password: string;
    }
  | {
      provider: 'otp';
      email: string;
      otp: string;
    };

export interface AuthResponse {
  isAuthenticated: boolean;
  message: string;
  accessToken?: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  socialLogin: (payload: SocialProvider) => void;
  logout: () => void;
  loginError: string | null;
}

export interface OAuthProviderConfig {
  clientId: string;
}

export interface SocialProviderConfig {
  provider: SocialProvider;
  clientId: string;
}

// types/index.ts

export const SOCIAL_PROVIDERS = ['google', 'facebook', 'linkedin'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

// export type SocialProvider = 'google' | 'facebook' | 'linkedin' | 'twitter' | 'github';

export interface AuthProviderProps {
  children: ReactNode;
  config: {
    apiBaseUrl?: string;
    apiEndpoints?:{
      login: string;
      register: string;
      logout: string;
    };
    tokenKey?: string;

    
    socialProviders?: SocialProviderConfig[];
    

    /**
     * Default redirect destination after login.
     * If `redirectTo` is provided, it overrides the `redirectTo` query param.
     */
    redirectTo?: string;

    /**
     * Optional redirect if already authenticated (e.g., trying to visit `/login`)
     * Defaults to `/` (home page) if not specified.
     */
    redirectIfAuthenticated?: string;

    /**
     * Optional redirect if not authenticated and accessing a protected route.
     * Defaults to `/login` if not specified.
     */
    redirectIfNotAuthenticated?: string;

    /**
     * Optional redirect destination after logout.
     * Defaults to `/login` if not specified.
     */
    redirectAfterLogout?: string;

    //calbacks
    onLoginSuccess?: (user: User | null) => void;
    onLoginFail?: (error: string) => void;
    onLogout?: () => void;
  };
}

export type OTPPayload = {
  phone: string;
  otp: string;
};

export type OAuthProvider = 'credentials' | 'otp' | 'magiclink';