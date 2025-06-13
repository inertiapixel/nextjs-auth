'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useMemo } from 'react';

export function useNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | null>(null);

  const fullPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      previousPathRef.current = sessionStorage.getItem('previousUrl');
      sessionStorage.setItem('previousUrl', fullPath);
    }
  }, [fullPath]);

  return {
    current: pathname,
    full: fullPath,
    previous: previousPathRef.current,
  };
}
