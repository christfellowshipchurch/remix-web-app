import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export type LoaderReturnType = {
  title: string;
  content: string;
};

export const loader: LoaderFunction = async (): Promise<
  ReturnType<typeof json<LoaderReturnType>>
> => {
  // Fetch data or perform any necessary operations
  const pageData: LoaderReturnType = {
    title: "Static Page",
    content: "This is an example of a static page content.",
  };

  // Return the data as JSON
  return json<LoaderReturnType>(pageData);
};
