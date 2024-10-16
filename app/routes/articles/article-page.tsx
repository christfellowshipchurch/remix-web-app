import React from "react";
import { LoaderReturnType } from "./loader";
import { Link, useLoaderData, useRouteError } from "@remix-run/react";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { RelatedArticles } from "./partials/related-articles.partial";

import { mockRelatedArticles } from "./mockData";

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <>
      <section className="bg-gradient-to-b from-white to-background_to dark:bg-gray-900">
        <ArticleHero {...data} />
        <div className="align-center mx-auto flex w-full flex-col items-center border-y border-solid border-slate-100">
          <ArticleContent htmlContent={data.content} />
          <ArticleNewsletter />
          <RelatedArticles
            tagId={mockRelatedArticles.tagId}
            articles={mockRelatedArticles.articles}
          />
        </div>
      </section>
    </>
  );
};
