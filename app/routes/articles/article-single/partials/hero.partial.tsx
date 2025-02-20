import ShareLinks from "~/components/share-links/share-links.component";
import ArticleAuthor from "../components/article-author.component";
import heroBgImgStyles from "~/styles/hero-bg-image-styles";
import { LoaderReturnType } from "../loader";
import Breadcrumbs from "~/components/breadcrumbs";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export interface AuthorProps {
  fullName: string;
  photo?: {
    uri: string;
  };
  authorAttributes?: {
    authorId: string;
  };
}

export const ArticleHero: React.FC<LoaderReturnType> = ({
  coverImage,
  title,
  summary,
  author,
  publishDate,
  readTime,
}: LoaderReturnType) => {
  return (
    <div style={heroBgImgStyles(coverImage)}>
      <div className="bg-white/80 backdrop-blur-lg px-6 md:px-16">
        <div className="flex py-10">
          <div className="flex flex-col sm:flex-col-reverse md:flex-row md:items-center lg:items-start mx-auto justify-between w-full max-w-[1438px]">
            <div className="flex flex-col justify-center lg:w-2/5 mt-4 md:mt-24 mr-10 mb-6 md:mb-0">
              {title && (
                <h1
                  className="mb-8 md:mb-4 max-w-2xl text-pretty heading-h1 leading-tight tracking-tight text-text_primary dark:text-white  md:leading-tight lg:text-6xl"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {summary && (
                <p
                  className="mb-6 hidden max-w-2xl font-light text-neutral-500 md:block  md:text-xl lg:mb-8"
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
              <h2 className="mt-10 hidden text-xl font-semibold md:block">
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
            {/* Cover Image - 4:3 ratio on lg screens */}
            <img
              className="rounded-md h-full w-full object-cover md:max-w-[250px] lg:max-w-[500px] xl:max-w-[800px]"
              src={coverImage}
              alt={title || "Cover"}
            />
          </div>
        </div>
        <div className="hidden md:block max-w-screen-content mx-auto">
          <hr className="border-neutral-lighter" />
          <div className="flex flex-col md:flex-row justify-between items-center py-10">
            <Breadcrumbs />
            <IconButton to="/messages/series" withRotatingArrow>
              Call to Action
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
