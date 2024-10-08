import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

const baseUrl = `${process.env.ROCK_API}`;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export type LoaderReturnType = {
  title: string;
  content: string;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<ReturnType<typeof json<LoaderReturnType>>> => {
  console.log({ params });
  // Fetch random article
  const res = await fetch(
    `${baseUrl}ContentChannelItems?$filter=Id%20eq%2012284&loadAttributes=simple`,
    {
      headers: {
        ...defaultHeaders,
      },
    }
  );

  const data = await res.json();

  const { Title, Content } = data[0];

  const pageData: LoaderReturnType = {
    title: Title,
    content: Content,
  };

  // Return the data as JSON
  return json<LoaderReturnType>(pageData);
};
