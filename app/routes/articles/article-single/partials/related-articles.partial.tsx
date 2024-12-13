import Button from "~/primitives/button";
import { RelatedArticleCard } from "../components/related-article-card.components";
import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export const RelatedArticles = () => {
  const { relatedArticles } = useLoaderData<LoaderReturnType>();
  const tagId = relatedArticles?.tagId;
  const articles = relatedArticles?.articles;

  const viewMoreLink = `/related-articles/${tagId}`;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center px-6 py-12 md:py-24 lg:max-w-6xl xl:max-w-7xl">
      {/* Header */}
      <div className="w-full ">
        <div className=" text-5xl font-semibold ">Related Reading</div>
        <div className="flex items-end justify-between text-lg font-light">
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </div>
          <Button
            href={viewMoreLink}
            className="hidden lg:block"
            intent="secondary"
          >
            View More
          </Button>
        </div>
      </div>
      <div className="my-4 flex w-full flex-col justify-center gap-6 md:my-8 lg:my-20 lg:flex-row">
        {articles?.map((article: any, i: number) => (
          <RelatedArticleCard
            key={i}
            title={article.title}
            description={article.summary}
            href={article.url}
            image={article.coverImage[0]}
            date={article.publishDate}
            author={article.author}
            readTime={article.readTime}
          />
        ))}
      </div>
      <Button
        className="mt-4 block px-6 py-4 text-xl md:mt-0 md:px-8 md:py-6 lg:hidden"
        size="sm"
        intent="secondary"
        href={viewMoreLink}
      >
        View More
      </Button>
    </div>
  );
};
