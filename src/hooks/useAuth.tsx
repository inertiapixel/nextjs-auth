'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthProvider';
import { useNavigation } from '../utils/useNavigation';

export const useAuth = (redirectIfNotAuthenticated = '/login') => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    isAuthenticated,
    loading,
    loginError,
    login,
    logout,
    socialLogin
  } = context;

  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Your custom navigation hook
  const { current, full } = useNavigation();

  useEffect(() => {
    const isOnLoginPage = current === redirectIfNotAuthenticated;
    const alreadyRedirecting = full.includes('redirectTo=');

    if (!loading && !isAuthenticated && !isOnLoginPage && !alreadyRedirecting) {
      const redirectTarget = full.startsWith(redirectIfNotAuthenticated)
        ? '/'
        : full;

      localStorage.setItem('redirectTo', redirectTarget);
      const redirectUrl = `${redirectIfNotAuthenticated}?redirectTo=${encodeURIComponent(
        redirectTarget
      )}`;
      router.push(redirectUrl);
    } else if (!loading) {
      setIsLoaded(true);
    }
  }, [loading, isAuthenticated, redirectIfNotAuthenticated, router, current, full]);

  const getToken = async () => {
    return localStorage.getItem('token') || '';
  };


  return {
    user,
    isAuthenticated,
    loading,
    isLoaded,
    getToken,
    loginError,
    login,
    logout,
    socialLogin
  };
};