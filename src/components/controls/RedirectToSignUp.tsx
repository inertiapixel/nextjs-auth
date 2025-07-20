'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectToSignUpProps {
  redirectUrl?: string;
}

const RedirectToSignUp = ({ redirectUrl = '/register' }: RedirectToSignUpProps) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(redirectUrl);
  }, [router, redirectUrl]);

  return null;
};

export default RedirectToSignUp;

/**
 * ===Usage===
 * <RedirectToSignUp />
 */