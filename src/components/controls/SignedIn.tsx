'use client';

import { useAuth } from '../../hooks/useAuth';

interface SignedInProps {
  children: React.ReactNode;
}

const SignedIn = ({ children }: SignedInProps) => {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return <>{children}</>;
};

export default SignedIn;
