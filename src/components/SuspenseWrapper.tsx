'use client';

import { Suspense } from 'react';

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
};
