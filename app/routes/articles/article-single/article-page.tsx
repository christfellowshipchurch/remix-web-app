import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router-dom";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { CardCarouselSection } from "~/components/resource-carousel";
import { RelatedArticleCard } from "./components/related-article-card.components";
import { CollectionItem } from "~/routes/page-builder/types";
import { AuthorProps } from "./partials/hero.partial";

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();
  const tagId = data.relatedArticles?.tagId;

  return (
    <section className="bg-white">
      <ArticleHero {...data} />
      <ArticleContent htmlContent={data.content} />

      <CardCarouselSection
        title="Related Reading"
        description="Explore more articles that you might find interesting."
        resources={data.relatedArticles?.articles || []}
        viewMoreText="More Articles"
        viewMoreLink={`/related-articles/${tagId}`}
        CardComponent={RelatedArticleCardWrapper}
      />

      <ArticleNewsletter />
    </section>
  );
};

// Wrapper component to adapt RelatedArticleCard to ResourceCarousel's interface
const RelatedArticleCardWrapper: React.FC<{
  resource: CollectionItem & { authorProps?: AuthorProps };
}> = ({ resource }) => {
  return (
    <RelatedArticleCard
      author={resource.authorProps}
      href={resource.pathname}
      title={resource.name}
      description={resource.summary}
      image={resource.image}
      date={resource.startDate || ""}
      readTime={resource.readTime?.toString() || "0"}
    />
  );
};
