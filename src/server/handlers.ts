import { NextRequest, NextResponse } from 'next/server';
import { SOCIAL_PROVIDERS } from '../types';
import { cleanUrl } from '../utils/common';

type Provider = (typeof SOCIAL_PROVIDERS)[number];

interface HandlerConfig {
  apiBaseUrl: string;
}

export const handlers = ({ apiBaseUrl }: HandlerConfig) =>
  async function handler(req: NextRequest): Promise<NextResponse> {
    console.log('handlers hit');
    const segments = req.nextUrl.pathname.split('/');
    const provider = segments[segments.length - 1] as Provider;

    if (!SOCIAL_PROVIDERS.includes(provider)) {
      return new NextResponse('Invalid OAuth provider', { status: 400 });
    }

    const code = req.nextUrl.searchParams.get('code');

    if (!code || !apiBaseUrl) {
      return new NextResponse(
        `<script>
          window.opener?.postMessage({
            error: ${!code ? "'Missing code'" : "'Missing apiBaseUrl'"}
          }, window.origin);
          window.close();
        </script>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const nodeApiUrl = cleanUrl(`${apiBaseUrl}/auth/${provider}`);

    try {
      const res = await fetch(nodeApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });


      const data = await res.json();

      return new NextResponse(
        `<script>
          window.opener?.postMessage(${JSON.stringify(data)}, window.origin);
          window.close();
        </script>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } catch (err) {
      console.error(`[OAuth Callback Error] ${provider}:`, err);

      return new NextResponse(
        `<script>
          window.opener?.postMessage({ error: 'OAuth callback failed' }, window.origin);
          window.close();
        </script>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }
  };
