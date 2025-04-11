import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { Breadcrumbs } from "../breadcrumbs";
import { Video } from "~/primitives/video/video.primitive";

import { Divider } from "~/routes/articles/all-articles/partials/latest.partial";
import { Link } from "react-router";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export type VideoHeaderTypes = {
  ctas?: { href: string; title: string }[];
  video?: string;
  wistiaId?: string;
  fallback?: React.ReactNode;
} & ({ video: string } | { wistiaId: string });

export const VideoHeader = ({
  ctas,
  video,
  wistiaId,
  fallback,
}: VideoHeaderTypes) => {
  // TODO: Make sure videos in Wistia have the controls removed and the theme is set to what it's in Figma...
  return (
    <div className="flex items-center justify-start self-stretch content-padding">
      <div className="flex flex-col gap-0 md:gap-12 w-full pb-10 lg:pb-0 mx-auto max-w-screen-content items-start justify-end self-stretch">
        {wistiaId ? (
          <div className="w-full">
            <Video wistiaId={wistiaId} fallback={fallback} />
          </div>
        ) : (
          video && <Video src={video} fallback={fallback} />
        )}
        <div className="flex items-center justify-between self-stretch">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
            <div className="hidden lg:block">
              <Breadcrumbs mode="light" />
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:block">
              <div className="mt-0 flex flex-row justify-start gap-4 relative group">
                {ctas?.map((cta, i) => (
                  <IconButton
                    key={i}
                    to={cta.href}
                    className="text-white border-[#FAFAFC] border w-full"
                    withRotatingArrow={i === ctas.length - 1}
                  >
                    {cta.title}
                  </IconButton>
                ))}
              </div>
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
        </div>
        <Divider bg="#D9D9D9" opacity="50%" />
      </div>
    </div>
  );
};
