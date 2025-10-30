import React, { useMemo } from "react";
import { LoaderReturnType } from "./loader";
import { useLoaderData } from "react-router-dom";
import { format } from "date-fns";

import { ArticleHero } from "./partials/hero.partial";
import { ArticleContent } from "./partials/content.partial";
import { ArticleNewsletter } from "./partials/newsletter.partial";
import { CardCarouselSection } from "~/components/resource-carousel";
import { RelatedArticleCard } from "./components/related-article-card.components";
import { CollectionItem } from "~/routes/page-builder/types";
import { AuthorProps } from "./partials/hero.partial";
import { Configure, InstantSearch, useHits } from "react-instantsearch";
import { createSearchClient } from "~/lib/create-search-client";
import { ContentItemHit } from "~/routes/search/types";

export const ArticlePage: React.FC = () => {
  const data = useLoaderData<LoaderReturnType>();

  const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = data;

  const searchClient = useMemo(
    () =>
      createSearchClient(ALGOLIA_APP_ID || "", ALGOLIA_SEARCH_API_KEY || ""),
    [ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY]
  );

  const { title, articlePrimaryCategories } = data;

  return (
    <section className="bg-white">
      <ArticleHero {...data} />
      <ArticleContent htmlContent={data.content} />

      {/* Related Articles Section */}
      <InstantSearch indexName="dev_contentItems" searchClient={searchClient}>
        <Configure
          filters={`contentType:"Article" AND NOT title:"${title}" AND articlePrimaryCategories:"${articlePrimaryCategories[0]}"`}
          hitsPerPage={6}
        />
        <CardCarouselSectionWrapper />
      </InstantSearch>

      <ArticleNewsletter />
    </section>
  );
};

const CardCarouselSectionWrapper = () => {
  const { items } = useHits<ContentItemHit>();

  if (items.length === 0) {
    return null;
  }

  return (
    <CardCarouselSection
      title="Related Reading"
      description="Explore more articles that you might find interesting."
      resources={items.map((item) => ({
        id: String(item.rockItemId ?? item.objectID),
        contentChannelId: "",
        contentType: "ARTICLES",
        name: item.title,
        summary: item.summary,
        image: item.coverImage.sources[0]?.uri ?? "",
        pathname: item.url,
        startDate: format(new Date(item.startDateTime), "d MMM yyyy"),
        readTime: item.articleReadTime,
        authorProps: {
          fullName:
            item.author.firstName && item.author.lastName
              ? `${item.author.firstName} ${item.author.lastName}`
              : "Christ Fellowship Team",
          photo: {
            uri:
              item.author.profileImage ||
              "http://cloudfront.christfellowship.church/GetImage.ashx?guid=A62B2B1C-FDFF-44B6-A26E-F1E213285153",
          },
          authorAttributes: {
            pathname: `${item.author.firstName}-${item.author.lastName}`
              .toLowerCase()
              .replace(/ /g, "-"),
          },
        },
      }))}
      viewMoreText="More Articles"
      viewMoreLink={`/articles/topics/todo`}
      CardComponent={RelatedArticleCardWrapper}
    />
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
      readTime={resource.readTime?.toString() || "1".toString()}
    />
  );
};
