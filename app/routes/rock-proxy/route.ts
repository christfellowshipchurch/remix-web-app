import { type LoaderFunctionArgs } from 'react-router-dom';
import { validateRockUrl } from '~/lib/.server/validate-rock-url';
import { fetchRockProxyHtml } from './rock-proxy.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const targetUrl = validateRockUrl(request);

  try {
    const html = await fetchRockProxyHtml(targetUrl);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Proxy error:', error);
    throw new Response('Failed to proxy content', { status: 500 });
  }
}
