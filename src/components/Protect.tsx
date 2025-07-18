'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Protect = ({
  children,
  redirectTo = '/login',
  loadingFallback = <p>Loading...</p>,
}: {
  children: React.ReactNode;
  redirectTo?: string;
  loadingFallback?: React.ReactNode;
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [loading, user, redirectTo, router]);

  if (loading) return <>{loadingFallback}</>;
  if (!user) return null;

  return <>{children}</>;
};
