import { Button } from "~/primitives/button/button.primitive";
import { Breadcrumbs } from "../breadcrumbs";
import { Video } from "~/primitives/video/video.primitive";

import { Divider } from "~/routes/articles/all-articles/partials/latest.partial";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export type VideoHeaderTypes = {
  ctas?: { href: string; title: string }[];
  videoClassName?: string;
  video?: string;
  wistiaId?: string;
  fallback?: React.ReactNode;
  controls?: boolean;
} & ({ video: string } | { wistiaId: string });

export const VideoHeader = ({
  ctas,
  video,
  wistiaId,
  fallback,
  videoClassName,
  controls,
}: VideoHeaderTypes) => {
  return (
    <div className="flex items-center justify-start self-stretch content-padding">
      <div className="flex flex-col gap-0 md:gap-12 w-full pb-10 lg:pb-0 mx-auto max-w-screen-content items-start justify-end self-stretch">
        {wistiaId ? (
          <div className="w-full">
            <Video
              controls={controls}
              wistiaId={wistiaId}
              fallback={fallback}
              className={videoClassName}
            />
          </div>
        ) : (
          video && (
            <Video src={video} fallback={fallback} className={videoClassName} />
          )
        )}
        <div className="flex items-center justify-between self-stretch flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
          {/* Breadcrumbs */}
          <div className="hidden lg:block">
            <Breadcrumbs mode="light" />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex flex-wrap justify-end gap-3">
            {ctas?.map((cta, i) => (
              <IconButton
                key={i}
                to={cta.href}
                className="text-white border-[#FAFAFC] border"
                withRotatingArrow={i === ctas.length - 1}
              >
                {cta.title}
              </IconButton>
            ))}
          </div>

          {/* Mobile CTAs */}
          <div className="lg:hidden flex flex-col md:flex-row gap-3 w-full pt-8 md:pt-0 md:px-0">
            {ctas?.map((cta, i) => (
              <Button
                key={i}
                intent={i === 0 ? "primary" : "secondary"}
                href={cta.href}
                className={`w-full md:w-auto ${
                  i !== 0 ? "text-white border-white" : ""
                }`}
              >
                {cta.title}
              </Button>
            ))}
          </div>
        </div>
        <Divider bg="#D9D9D9" opacity="50%" />
      </div>
    </div>
  );
};
