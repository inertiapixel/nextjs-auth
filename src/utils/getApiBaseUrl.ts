import { NextRequest } from 'next/server';

export function getApiBaseUrl(req: NextRequest): string | null {
  const urlParam = req.nextUrl.searchParams.get('apiBaseUrl');

  // Prefer query param over env (if you want fallback)
  return urlParam || null;
}
