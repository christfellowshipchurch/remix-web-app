import { Link, useLoaderData } from "react-router";
import { Article, ArticlesReturnType } from "../loader";
import Icon from "~/primitives/icon";
import { Divider } from "./latest.partial";

export const Articles = () => {
  const { upcomingArticles: articles } = useLoaderData<ArticlesReturnType>();

  return (
    <div className="flex flex-col gap-14">
      {articles.map((article, i) => (
        <ArticlePanel article={article} key={i} />
      ))}
    </div>
  );
};

const ArticlePanel = ({ article }: { article: Article }) => {
  return (
    <Link
      to={`/articles/${article.attributeValues.url.value}`}
      prefetch="intent"
      className="flex flex-col gap-5 w-full"
    >
      <div className="flex flex-col gap-2">
        <div className="w-full">
          <img
            src={article.image}
            className="w-full h-auto object-cover"
            alt={article.title}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Icon name="calendarAlt" size={16} />
            <p className="font-medium text-text-secondary break-words">
              {article.startDate.toUpperCase()}
            </p>
          </div>
        </div>
        <Divider />
      </div>
      <div className="w-full">
        <h3 className="font-extrabold text-[36px] break-words">
          {article.title}
        </h3>
        <p className="break-words">{article.attributeValues.summary.value}</p>
        {/* TODO: Add CTA part */}
      </div>
    </Link>
  );
};
