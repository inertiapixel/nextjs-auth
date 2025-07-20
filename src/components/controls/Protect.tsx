'use client';

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  redirectTo?: string;
}

const Protect = ({ children, loadingFallback = null, redirectTo = '/login' }: ProtectProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  if (loading) return <>{loadingFallback}</>;
  if (!user) return null;

  return <>{children}</>;
};

export default Protect;


/**
 * ======USAGE=====
 * 
 *  <Protect loadingFallback={<p>Loading...</p>} redirectTo="/login">
 *       <Dashboard />
 *  </Protect>
 */