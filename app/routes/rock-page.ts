import { LoaderFunction } from "react-router-dom";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    throw new Response("URL parameter required", { status: 400 });
  }

  try {
    // Fetch the content from Rock RMS
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RockRMS-Proxy/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Response(`Failed to fetch content: ${response.status}`, {
        status: response.status,
      });
    }

    const html = await response.text();

    // Extract the base URL for resolving relative paths
    const baseUrl = new URL(targetUrl);
    const baseUrlString = `${baseUrl.protocol}//${baseUrl.host}`;

    // Extract CSS links from the original HTML
    const cssLinks =
      html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
    const cssUrls = cssLinks
      .map((link) => {
        const hrefMatch = link.match(/href=["']([^"']*)["']/);
        if (hrefMatch) {
          let href = hrefMatch[1];
          if (href.startsWith("/")) {
            href = baseUrlString + href;
          } else if (!href.startsWith("http")) {
            href = baseUrlString + "/" + href;
          }
          return `<link rel="stylesheet" href="${href}">`;
        }
        return link;
      })
      .join("\n");

    // Replace specific FontAwesome icons with project icons
    const iconReplacement = `
      <style>
        /* Replace FontAwesome icons with project icons */
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
        
        /* Fallback for other FontAwesome icons */
        .fa:not(.fa-envelope):not(.fa-phone):not(.fa-phone-square):before {
          content: "?" !important;
          font-family: Arial, sans-serif !important;
          font-weight: bold !important;
          color: #666 !important;
        }
      </style>
    `;

    // Extract JS scripts
    const jsScripts =
      html.match(/<script[^>]*src=["'][^"']*["'][^>]*><\/script>/gi) || [];
    const jsUrls = jsScripts
      .map((script) => {
        const srcMatch = script.match(/src=["']([^"']*)["']/);
        if (srcMatch) {
          let src = srcMatch[1];
          if (src.startsWith("/")) {
            src = baseUrlString + src;
          } else if (!src.startsWith("http")) {
            src = baseUrlString + "/" + src;
          }
          return `<script src="${src}"></script>`;
        }
        return script;
      })
      .join("\n");

    // Modify the HTML to work better in iframe
    const modifiedHtml = html
      // Remove any X-Frame-Options meta tags
      .replace(/<meta[^>]*http-equiv="X-Frame-Options"[^>]*>/gi, "")
      // Remove CSP meta tags that might block embedding
      .replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/gi, "")
      // Remove existing CSS and JS links (we'll add them back with absolute URLs)
      .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, "")
      .replace(/<script[^>]*src=["'][^"']*["'][^>]*><\/script>/gi, "")
      // Fix relative paths in CSS url() functions
      .replace(/url\(\/([^)]*)\)/gi, `url(${baseUrlString}/$1)`)
      .replace(/url\(['"]?\/([^'")]*)/gi, `url('${baseUrlString}/$1`)
      // Add base tag to help with relative paths
      .replace("<head>", `<head><base href="${baseUrlString}/">`)
      // Add all the CSS and JS back with absolute URLs
      .replace(
        "</head>",
        `
        ${cssUrls}
        ${jsUrls}
        ${iconReplacement}
        <style>
          /* Rock RMS iframe-specific styles */
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
          /* Ensure forms work in iframe */
          form { 
            margin: 0; 
            width: 100%;
            max-width: none;
          }
          /* Fix any positioning issues */
          .container, .wrapper { 
            max-width: none !important; 
            width: 100% !important;
          }
          /* Rock RMS specific form styling */
          .rock-form, .rock-content {
            font-family: inherit !important;
            background: #fff !important;
          }
          /* Ensure form elements are properly styled */
          input, select, textarea, button {
            font-family: inherit !important;
            box-sizing: border-box !important;
          }
          /* Fix any layout issues */
          .row, .col, .col-md-6, .col-lg-4 {
            margin: 0 !important;
            padding: 0 10px !important;
          }
          
          /* Hide navigation, footer, and header elements for clean embedding */
          .navbar, .navbar-default, .navbar-static-top,
          .page-footer, .text-muted,
          header, .header, .site-header,
          .main-header, .page-header,
          nav, .nav, .navigation,
          footer, .footer, .site-footer {
            display: none !important;
          }
          
          /* Ensure main content takes full width when navbar/footer are hidden */
          .main-content, .content, .page-content,
          .container-fluid, .container {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        </style>
        <script>
          // Ensure parent communication works
          if (window.parent !== window) {
            window.parent.postMessage({ type: 'rock-iframe-loaded' }, '*');
          }
          
          // Fix any remaining relative paths after page load
          document.addEventListener('DOMContentLoaded', function() {
            // Fix any images with relative paths
            const images = document.querySelectorAll('img[src^="/"]');
            images.forEach(img => {
              img.src = '${baseUrlString}' + img.src;
            });
            
            // Fix any links with relative paths
            const links = document.querySelectorAll('a[href^="/"]');
            links.forEach(link => {
              link.href = '${baseUrlString}' + link.href;
            });
            
            // Fix any background images
            const elements = document.querySelectorAll('[style*="background-image"]');
            elements.forEach(el => {
              const style = el.getAttribute('style');
              if (style && style.includes('url(/')) {
                // eslint-disable-next-line no-useless-escape
                el.setAttribute('style', style.replace(/url\(\//g, 'url(' + '${baseUrlString}/'));
              }
            });
          });
        </script>
        </head>`
      );

    return new Response(modifiedHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy": "frame-ancestors *",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    throw new Response("Failed to proxy content", { status: 500 });
  }
};
