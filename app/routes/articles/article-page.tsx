import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "@remix-run/react";

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>(); // Correctly fetch the data from the loader

  return (
    <div className="p-32">
      <h1 className="text-4xl font-bold mb-32">{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
};
