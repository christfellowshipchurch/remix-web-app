import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { RelatedArticles } from "./partials/related-articles.partial";

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <section className="bg-white">
        {/* TODO: Fix Error */}
        <ArticleHero {...data} />
        <div className="align-center mx-auto flex w-full flex-col items-center border-y border-solid border-slate-100">
          <ArticleContent htmlContent={data.content} />
          <ArticleNewsletter />
        </div>
        <RelatedArticles />
      </section>
    </>
  );
};
