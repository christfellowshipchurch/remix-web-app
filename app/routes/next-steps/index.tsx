import { useEffect, useState } from "react";
import { useLoaderData, useLocation, redirect } from "react-router-dom";
import { LoaderFunction } from "react-router-dom";
import { load } from "cheerio";

export type LoaderReturnType = {
  headContent: string;
  bodyContent: string;
};

export const loader: LoaderFunction = async () => {
  const response = await fetch(
    "https://cfdp-marketing-site.webflow.io/next-steps"
  );

  if (!response.ok) {
    return redirect("/404");
  }

  const html = await response.text();
  const $ = load(html);

  // Extract head content (excluding script tags)
  const headContent = $("head").html() || "";

  // Extract body content and remove the specific Webflow script
  let bodyContent = $("body").html() || "";

  // TODO: Remove the specific Webflow script that shows the webflow badge ??

  return { headContent, bodyContent };
};

export default function NextStepsPage() {
  const location = useLocation();
  const { headContent, bodyContent } = useLoaderData<LoaderReturnType>();
  const [iframeContent, setIframeContent] = useState<string>("");
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  // Refresh the page if the URL contains #refresh
  useEffect(() => {
    if (location.hash === "#refresh") {
      window.location.href = "/next-steps";
    }
  }, [location]);

  // Create iframe content when HTML is available
  useEffect(() => {
    if (bodyContent && headContent) {
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            ${headContent}
          </head>
          <body>
            ${bodyContent}
          </body>
        </html>
      `;
      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setIframeContent(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [bodyContent, headContent]);

  if (!iframeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <iframe
        ref={setIframeRef}
        src={iframeContent}
        className="w-full min-h-screen border-0"
        title="Next Steps"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => {
          // Reset scroll position when iframe loads
          window.scrollTo(0, 0);
        }}
      />
    </div>
  );
}
