'use client';

import { useAuth } from '../../hooks/useAuth';

interface SignedOutProps {
  children: React.ReactNode;
}

const SignedOut = ({ children }: SignedOutProps) => {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return <>{children}</>;
};

export default SignedOut;
