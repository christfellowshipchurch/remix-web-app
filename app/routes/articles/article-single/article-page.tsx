import React from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router-dom";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { CardCarouselSection } from "~/components/resource-carousel";
import { RelatedArticleCard } from "./components/related-article-card.components";
import { CollectionItem } from "~/routes/page-builder/types";
import { FormattedArticle } from "~/lib/.server/fetch-related-articles";
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
        resources={
          data.relatedArticles?.articles?.map(
            mapFormattedArticleToCollectionItem
          ) || []
        }
        viewMoreText="More Articles"
        viewMoreLink={`/related-articles/${tagId}`}
        CardComponent={RelatedArticleCardWrapper}
      />

      <ArticleNewsletter />
    </section>
  );
};

// Mapping function to convert FormattedArticle to CollectionItem
const mapFormattedArticleToCollectionItem = (
  article: FormattedArticle
): CollectionItem & { authorProps?: AuthorProps } => {
  const authorProps: AuthorProps | undefined =
    typeof article.author === "object" && article.author
      ? {
          fullName: `${
            (article.author as { firstName?: string; lastName?: string })
              .firstName || ""
          } ${
            (article.author as { firstName?: string; lastName?: string })
              .lastName || ""
          }`.trim(),
          photo: (article.author as { photo?: { uri: string } }).photo,
          authorAttributes: (
            article.author as {
              authorAttributes?: { authorId: string; pathname: string };
            }
          ).authorAttributes,
        }
      : undefined;

  return {
    id: article.url || "",
    name: article.title,
    summary: article.summary || "",
    image: Array.isArray(article.coverImage) ? article.coverImage[0] : "",
    pathname: article.url || "",
    startDate: article.publishDate,
    author:
      typeof article.author === "object" && article.author
        ? `${
            (article.author as { firstName?: string; lastName?: string })
              .firstName || ""
          } ${
            (article.author as { firstName?: string; lastName?: string })
              .lastName || ""
          }`.trim()
        : String(article.author || ""),
    readTime: article.readTime,
    contentChannelId: "43",
    contentType: "ARTICLES" as const,
    authorProps,
  };
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
