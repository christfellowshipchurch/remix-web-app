import { describe, expect, it, vi } from 'vitest';
import { fetchRockProxyHtml } from '../rock-proxy.server';

describe('fetchRockProxyHtml minimal mode', () => {
  it('preserves original script tags while injecting base href and resize script', async () => {
    const targetUrl = 'https://rock.christfellowship.church/page/5886?OpportunityId=abc-123';
    const originalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
          <link rel="stylesheet" href="/Styles/site.css">
          <script src="/Scripts/app.js"></script>
        </head>
        <body>
          <form id="rock-form">Apply</form>
        </body>
      </html>
    `;

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(originalHtml, { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const html = await fetchRockProxyHtml(targetUrl, 'minimal');

    expect(fetchMock).toHaveBeenCalledWith(
      targetUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': 'Mozilla/5.0 (compatible; RockRMS-Proxy/1.0)',
        }),
      }),
    );
    expect(html).toContain('<base href="https://rock.christfellowship.church/">');
    expect(html).toContain('<script src="/Scripts/app.js"></script>');
    expect(html).toContain('rock-iframe-resize');
    expect(html).not.toContain('X-Frame-Options');
  });
});
