import type { LoaderFunctionArgs } from 'react-router-dom';

/**
 * Resource route: serves valid robots.txt so crawlers and check-site-meta get
 * plain text, not the SPA HTML. Must start with a comment or User-agent directive.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { origin } = new URL(request.url);
  const sitemapUrl = `${origin}/sitemap.xml`;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
