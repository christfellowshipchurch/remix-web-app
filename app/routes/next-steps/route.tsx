import {
  Links,
  LoaderFunction,
  redirect,
  useLoaderData,
  Meta,
} from "react-router-dom";
import { load } from "cheerio";
import { Footer } from "~/components";
import { NavbarSimple } from "~/components/navbar-simple/navbar-simple.component";
import "~/components/navbar-simple/navbar-simple.styles.css";

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
        <div dangerouslySetInnerHTML={{ __html: data.head }} />
        <Links />
        <Meta />
      </head>
      <body>
        {/* Insert alternate navbar here */}
        <NavbarSimple />
        <div dangerouslySetInnerHTML={{ __html: data.body }} />
        <Footer />
      </body>
    </html>
  );
}
