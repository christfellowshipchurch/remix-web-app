import { Breadcrumbs, ShareLinks } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

import ArticleAuthor from "../components/article-author.component";
import heroBgImgStyles from "~/styles/hero-bg-image-styles";
import { LoaderReturnType } from "../loader";

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
      <div className="bg-white/80 backdrop-blur-lg content-padding">
        <div className="flex flex-col items-start justify-start gap-8 pt-12 lg:pt-34 pb-8 max-w-screen-content mx-auto">
          <div className="flex flex-col gap-8 sm:flex-col-reverse lg:flex-row lg:items-center xl:items-start justify-between w-full">
            <div className="flex flex-col gap-8 justify-center">
              <div className="flex flex-col gap-8 lg:gap-2">
                {title && (
                  <h1
                    className="text-pretty font-extrabold text-[48px] leading-tight tracking-tight text-text_primary dark:text-white  lg:text-6xl"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                )}
                {summary && (
                  <p
                    className="hidden font-light text-neutral-500 lg:block md:text-xl"
                    dangerouslySetInnerHTML={{ __html: summary }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-6">
                {/* Author */}
                {author && (
                  <ArticleAuthor
                    author={author}
                    publishDate={publishDate || ""}
                    readTime={readTime || 0}
                  />
                )}

                {/* Share Links */}
                <div className="flex flex-col lg:gap-5">
                  <h2 className="hidden text-xl font-semibold lg:block">
                    Share this Article
                  </h2>
                  <div className="flex">
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
              </div>
            </div>
            {/* Cover Image */}
            <img
              className="rounded-md h-full w-full object-cover lg:max-w-[320px] lg:h-[520px] xl:h-full xl:max-w-[700px]"
              src={coverImage}
              alt={title || "Cover"}
            />
          </div>
          <div className="hidden md:block w-full">
            <hr className="border-neutral-lighter hidden lg:block" />
            <div className="flex flex-col md:flex-row justify-between items-center lg:pt-10">
              <div className="hidden lg:block">
                <Breadcrumbs mode="dark" />
              </div>
              <div className="hidden md:block">
                <IconButton
                  className="hover:!text-ocean"
                  to="/messages/series"
                  withRotatingArrow
                >
                  Call to Action
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
