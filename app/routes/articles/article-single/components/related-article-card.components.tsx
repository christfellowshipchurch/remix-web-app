import { Link } from "react-router";
import { CardAuthor, CardProps } from "./card-author.component";

export function RelatedArticleCard({
  author,
  href,
  title,
  description,
  image,
  date,
  readTime,
  ...props
}: CardProps) {
  if (href) {
    return (
      <Link
        to={`/articles/${href}`}
        /**
         * TODO : Re add this prefetch once Related Articles API is implemented
         */
        //prefetch="viewport"
        className="flex flex-1 cursor-pointer flex-col overflow-hidden rounded-lg bg-transparent transition-transform duration-300 hover:-translate-y-3"
      >
        <img
          className="relative h-60 w-full sm:h-80 md:h-96 lg:h-64 lg:w-full xl:h-72 object-cover"
          src={image}
          alt={title}
        />
        <div className="flex grow flex-col justify-between bg-white p-6">
          <div>
            <div className="mb-2 text-2xl font-semibold">{title}</div>
            <div className="mb-6 font-extralight">{description}</div>
          </div>
          {author && (
            <CardAuthor
              name={author?.fullName}
              image={author?.photo?.uri}
              date={date}
              timeRead={readTime}
            />
          )}
        </div>
      </Link>
    );
  }

  return <div>{props.children}</div>;
}
