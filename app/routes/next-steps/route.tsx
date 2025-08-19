import {
  Links,
  LoaderFunction,
  Meta,
  redirect,
  ScrollRestoration,
  useLoaderData,
  Scripts,
} from "react-router-dom";

import { AuthProvider } from "../../providers/auth-provider";
import { NavbarVisibilityProvider } from "../../providers/navbar-visibility-context";
import { CookieConsentProvider } from "../../providers/cookie-consent-provider";
import { GTMProvider } from "../../providers/gtm-provider";

import { load } from "cheerio";
import { Footer, Navbar } from "~/components";

export type LoaderReturnType = {
  head: string;
  body: string;
  dataWfPage: string;
  dataWfSite: string;
};

export const loader: LoaderFunction = async () => {
  const response = await fetch(
    `https://cfdp-marketing-site.webflow.io/next-steps`
  );
  if (!response.ok) {
    redirect("/404");
  }
  const html = await response.text();

  // Load the HTML into Cheerio
  const $ = load(html);

  const htmlTag = $("html");
  const dataWfPage = htmlTag.attr("data-wf-page");
  const dataWfSite = htmlTag.attr("data-wf-site");

  // Separate the <head> and <body> contents
  const head = $("head").html(); // Get the inner HTML of the <head> tag
  const body = $("body").html(); // Get the inner HTML of the <body> tag

  return { dataWfPage, dataWfSite, head, body };
};

export default function DynamicPages() {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <html
      data-wf-page={data.dataWfPage}
      data-wf-site={data.dataWfSite}
      lang="en"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <div dangerouslySetInnerHTML={{ __html: data.head }} />
      </head>

      <body>
        <GTMProvider gtmId="GTM-PFW26V4V">
          <AuthProvider>
            <CookieConsentProvider>
              <NavbarVisibilityProvider>
                <div className="min-h-screen flex flex-col text-pretty">
                  {/* <Navbar /> */}
                  <div dangerouslySetInnerHTML={{ __html: data.body }} />
                  <Footer />
                </div>
              </NavbarVisibilityProvider>
            </CookieConsentProvider>
          </AuthProvider>
        </GTMProvider>

        <ScrollRestoration />
        {/* <Scripts /> */}
      </body>
    </html>
  );
}
