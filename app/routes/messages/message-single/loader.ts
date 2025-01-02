import type { LoaderFunction } from "react-router";

export type LoaderReturnType = {
  hostUrl: string;
  title: string;
  content: string;
  coverImage: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const messagesPath = params?.path || "";
  const messagesId = messagesPath.split("-").pop();

  const pageData: LoaderReturnType = {
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    title: "My Message Title",
    content: "My message content",
    coverImage: "https://via.placeholder.com/800x400",
  };

  return pageData;
};
