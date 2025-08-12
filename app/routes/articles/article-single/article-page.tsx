import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router-dom";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { CardCarouselSection } from "~/components/resource-carousel";
import { RelatedArticleCard } from "./components/related-article-card.components";

// Wrapper component to adapt RelatedArticleCard to ResourceCarousel's interface
const RelatedArticleCardWrapper: React.FC<{ resource: any }> = ({
  resource,
}) => {
  return (
    <RelatedArticleCard
      author={resource.author}
      href={resource.url}
      title={resource.title}
      description={resource.summary}
      image={resource.coverImage[0]}
      date={resource.publishDate}
      readTime={resource.readTime}
    />
  );
};

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  const tagId = data.relatedArticles?.tagId;
  return (
    <>
      <section className="bg-white">
        <ArticleHero {...data} />
        <ArticleContent htmlContent={data.content} />
        <ArticleNewsletter />

        <CardCarouselSection
          title="Related Reading"
          description="Explore more articles that you might find interesting."
          resources={data.relatedArticles?.articles || []}
          viewMoreText="More Articles"
          viewMoreLink={`/related-articles/${tagId}`}
          CardComponent={RelatedArticleCardWrapper}
        />
      </section>
    </>
  );
};
