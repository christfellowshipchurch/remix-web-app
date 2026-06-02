export type RockProxyMode = 'full' | 'minimal';

/**
 * Fetches a Rock RMS page and transforms its HTML for clean iframe embedding.
 *
 * `full` mode:
 * - Resolves all relative CSS/JS/asset URLs to absolute
 * - Hides Rock's own nav, header, and footer
 * - Injects FontAwesome icon replacements
 * - Posts `rock-iframe-loaded` to parent window on load
 *
 * `minimal` mode preserves the original Rock HTML/JS load order and only:
 * - Strips frame-blocking meta tags
 * - Adds a base href so relative assets resolve to Rock
 * - Injects embed chrome-hiding CSS and a height postMessage script
 */
export async function fetchRockProxyHtml(
  targetUrl: string,
  mode: RockProxyMode = 'full',
): Promise<string> {
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RockRMS-Proxy/1.0)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Response(`Failed to fetch content: ${response.status}`, {
      status: response.status,
    });
  }

  const html = await response.text();

  const baseUrl = new URL(targetUrl);
  const baseUrlString = `${baseUrl.protocol}//${baseUrl.host}`;

  if (mode === 'minimal') {
    return buildMinimalProxyHtml(html, baseUrlString);
  }

  const cssLinks = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
  const cssUrls = cssLinks
    .map((link) => {
      const hrefMatch = link.match(/href=["']([^"']*)["']/);
      if (hrefMatch) {
        let href = hrefMatch[1];
        if (href.startsWith('/')) {
          href = baseUrlString + href;
        } else if (!href.startsWith('http')) {
          href = baseUrlString + '/' + href;
        }
        return `<link rel="stylesheet" href="${href}">`;
      }
      return link;
    })
    .join('\n');

  const iconReplacement = `
      <style>
        .fa-envelope:before {
          content: "" !important;
          display: inline-block !important;
          width: 1em !important;
          height: 1em !important;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/%3E%3C/svg%3E") !important;
          background-size: contain !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
        }

        .fa-phone-square:before, .fa-phone:before {
          content: "" !important;
          display: inline-block !important;
          width: 1em !important;
          height: 1em !important;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'/%3E%3C/svg%3E") !important;
          background-size: contain !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
        }

        .fa:not(.fa-envelope):not(.fa-phone):not(.fa-phone-square):before {
          content: "?" !important;
          font-family: Arial, sans-serif !important;
          font-weight: bold !important;
          color: #666 !important;
        }
      </style>
    `;

  const jsScripts =
    html.match(/<script[^>]*src=["'][^"']*["'][^>]*><\/script>/gi) || [];
  const jsUrls = jsScripts
    .map((script) => {
      const srcMatch = script.match(/src=["']([^"']*)["']/);
      if (srcMatch) {
        let src = srcMatch[1];
        if (src.startsWith('/')) {
          src = baseUrlString + src;
        } else if (!src.startsWith('http')) {
          src = baseUrlString + '/' + src;
        }
        return `<script src="${src}"></script>`;
      }
      return script;
    })
    .join('\n');

  /* eslint-disable no-useless-escape */
  const modifiedHtml = html
    .replace(/<meta[^>]*http-equiv="X-Frame-Options"[^>]*>/gi, '')
    .replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/gi, '')
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
    .replace(/<script[^>]*src=["'][^"']*["'][^>]*><\/script>/gi, '')
    .replace(/url\(\/([^)]*)\)/gi, `url(${baseUrlString}/$1)`)
    .replace(/url\(['"]?\/([^'")]*)/gi, `url('${baseUrlString}/$1`)
    .replace('<head>', `<head><base href="${baseUrlString}/">`)
    .replace(
      '</head>',
      `
        ${cssUrls}
        ${jsUrls}
        ${iconReplacement}
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: inherit;
            background: #fff;
          }
          .rock-page {
            min-height: 100vh;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
          }
          form {
            margin: 0;
            width: 100%;
            max-width: none;
          }
          .container, .wrapper {
            max-width: none !important;
            width: 100% !important;
          }
          .rock-form, .rock-content {
            font-family: inherit !important;
            background: #fff !important;
          }
          input, select, textarea, button {
            font-family: inherit !important;
            box-sizing: border-box !important;
          }
          .row, .col, .col-md-6, .col-lg-4 {
            margin: 0 !important;
            padding: 0 10px !important;
          }
          .navbar, .navbar-default, .navbar-static-top,
          .page-footer, .text-muted,
          header, .header, .site-header,
          .main-header, .page-header,
          nav, .nav, .navigation,
          footer, .footer, .site-footer {
            display: none !important;
          }
          .main-content, .content, .page-content,
          .container-fluid, .container {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        </style>
        <script>
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'rock-iframe-loaded' }, '*');
          }

          document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img[src^="/"]');
            images.forEach(img => {
              img.src = '${baseUrlString}' + img.src;
            });

            const links = document.querySelectorAll('a[href^="/"]');
            links.forEach(link => {
              link.href = '${baseUrlString}' + link.href;
            });

            const elements = document.querySelectorAll('[style*="background-image"]');
            elements.forEach(el => {
              const style = el.getAttribute('style');
              if (style && style.includes('url(/')) {
                el.setAttribute('style', style.replace(/url\(\//g, 'url(' + '${baseUrlString}/'));
              }
            });
          });
        </script>
        </head>`,
    );
  /* eslint-enable no-useless-escape */

  return modifiedHtml;
}

function buildMinimalProxyHtml(html: string, baseUrlString: string): string {
  const embedStyles = `
    <style data-rock-minimal-proxy>
      body {
        margin: 0;
        padding: 0;
        background: #fff;
      }
      .navbar, .navbar-default, .navbar-static-top,
      .page-footer, .text-muted,
      header, .header, .site-header,
      .main-header, .page-header,
      nav, .nav, .navigation,
      footer, .footer, .site-footer {
        display: none !important;
      }
      .main-content, .content, .page-content,
      .container-fluid, .container {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    </style>
  `;

  const resizeScript = `
    <script data-rock-minimal-proxy>
      (function() {
        function reportHeight() {
          var body = document.body;
          var root = document.documentElement;
          var height = Math.max(
            body ? body.scrollHeight : 0,
            root ? root.scrollHeight : 0
          );

          if (window.parent !== window && height) {
            window.parent.postMessage({ type: 'rock-iframe-resize', height: height }, '*');
          }
        }

        function init() {
          reportHeight();

          if (typeof ResizeObserver !== 'undefined' && document.body) {
            new ResizeObserver(reportHeight).observe(document.body);
          }

          if (typeof MutationObserver !== 'undefined' && document.body) {
            new MutationObserver(reportHeight).observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true,
            });
          }

          window.addEventListener('load', reportHeight);
          window.addEventListener('resize', reportHeight);

          if (window.parent !== window) {
            window.parent.postMessage({ type: 'rock-iframe-loaded' }, '*');
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
        } else {
          init();
        }
      })();
    </script>
  `;

  return html
    .replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, '')
    .replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '')
    .replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${baseUrlString}/">${embedStyles}`,
    )
    .replace(/<\/body>/i, `${resizeScript}</body>`);
}
