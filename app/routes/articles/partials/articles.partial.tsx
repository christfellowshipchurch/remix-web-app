import { useLoaderData } from "react-router";
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <img src={article.image} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Icon name="calendarAlt" size={16} />
            <p className="font-medium text-[#666666]">
              {article.startDate.toUpperCase()}
            </p>
          </div>
        </div>
        <Divider />
      </div>
      <div>
        <h3 className="font-extrabold text-[36px]">{article.title}</h3>
        <p>{article.attributeValues.summary.value}</p>
        {/* TODO: Add CTA part */}
      </div>
    </div>
  );
};
