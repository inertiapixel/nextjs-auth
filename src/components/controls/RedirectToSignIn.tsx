'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectToSignInProps {
  redirectUrl?: string;
}

const RedirectToSignIn = ({ redirectUrl = '/login' }: RedirectToSignInProps) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectUrl);
  }, [router, redirectUrl]);

  return null;
};

export default RedirectToSignIn;

/**
 * ====Usage====
 * <RedirectToSignIn />
 * <RedirectToSignIn redirectUrl="/auth/signin" />
 * 
 */