import ShareLinks from "~/components/share-links/share-links.component";
import ArticleAuthor from "../components/article-author.component";

export interface AuthorProps {
  fullName: string;
  photo?: {
    uri: string;
  };
  authorAttributes?: {
    authorId: string;
  };
}

export interface ArticleHeroProps extends React.HTMLAttributes<HTMLElement> {
  coverImage?: string;
  title?: string;
  summary?: string;
  author?: AuthorProps;
  publishDate?: string;
  readTime?: number;
}

// due to CSS rendering issues, we needed to move these styles to a separate function to show correctly...
const heroBgImgStyles = (image?: string) => {
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

export const ArticleHero: React.FC<ArticleHeroProps> = ({
  coverImage,
  title,
  summary,
  author,
  publishDate,
  readTime,
}) => {
  return (
    <div style={heroBgImgStyles(coverImage)} className={`mx-auto w-full`}>
      <div className="mx:px-2 flex h-full justify-center bg-white/80 px-6 pb-10 pt-16 backdrop-blur-lg lg:px-12 lg:py-56">
        <div className="flex w-full max-w-screen-xl flex-col md:flex-row md:items-center lg:items-start ">
          <div className="flex flex-col justify-center lg:w-2/5">
            {title && (
              <h1
                className="mb-4 max-w-2xl text-pretty text-5xl font-bold leading-tight tracking-tight text-text_primary dark:text-white  md:leading-tight xl:text-6xl"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {summary && (
              <p
                className="mb-6 hidden max-w-2xl font-light text-link_secondary md:block  md:text-xl lg:mb-8"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            )}
            {/* Author */}
            {author && (
              <ArticleAuthor
                author={author}
                publishDate={publishDate || ""}
                readTime={readTime || 0}
              />
            )}

            {/* Share Links */}
            <h2 className="mt-10 hidden text-2xl font-semibold md:block">
              Share this Article
            </h2>
            <div className="mt-3 flex">
              <div className="flex gap-2">
                <ShareLinks
                  size={10}
                  socialMedia={[
                    { type: "twitter", url: "/twitter" },
                    { type: "facebook", url: "/facebook" },
                    { type: "linkedIn", url: "/linkedIn" },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Cover Image */}
          <div className="mt-10 h-60 w-full sm:h-80 md:ml-6 md:w-96 lg:my-0 lg:w-3/5 xl:h-[400px]">
            <img
              className="rounded-md relative flex size-full justify-center"
              src={coverImage}
              alt={title || "Cover"}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
