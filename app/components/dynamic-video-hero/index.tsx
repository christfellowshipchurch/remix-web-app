import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import Breadcrumbs from "../breadcrumbs";
import { Video } from "~/primitives/video/video.primitive";

import { Divider } from "~/routes/articles/all-articles/partials/latest.partial";
import { Link } from "react-router";

export type DynamicVideoHeaderTypes = {
  ctas?: { href: string; title: string }[];
  video?: string;
  wistiaId?: string;
} & ({ video: string } | { wistiaId: string });

export const DynamicVideoHeader = ({
  ctas,
  video,
  wistiaId,
}: DynamicVideoHeaderTypes) => {
  // TODO: Make sure videos in Wistia have the controls removed and the theme is set to what it's in Figma...
  // TODO: Update margin top once the navbar is updated?
  return (
    <div className="flex items-center justify-start self-stretch content-padding">
      <div className="flex flex-col gap-12 w-full pb-16 mx-auto max-w-screen-content items-start justify-end self-stretch">
        {wistiaId ? (
          <div className="w-full">
            <Video wistiaId={wistiaId} />
          </div>
        ) : (
          video && <Video src={video} />
        )}
        <div className="flex items-center justify-between self-stretch">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
            <Breadcrumbs />

            {/* CTAs */}
            <div className="mt-5 md:mt-0 flex justify-start gap-3 pr-1 md:pr-4 md:gap-4 relative group">
              {ctas?.map((cta, i) => (
                <Link className="relative" key={i} to={cta.href}>
                  <Button
                    intent="secondary"
                    className="font-semibold text-white border-white rounded-none hover:enabled:bg-slate-300/20 px-2 py-1.5"
                  >
                    {cta.title}
                  </Button>
                  {/* TODO: incorporate this into the button component */}
                  <div
                    className={`${
                      i < 1 ? "hidden" : ""
                    } absolute rounded-full p-1 md:p-2 bg-ocean -right-5 top-[50%] translate-y-[-50%] rotate-[135deg] group-hover:rotate-180 transition-all duration-300`}
                  >
                    <Icon name="arrowBack" size={26} color="white" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Divider bg="#D9D9D9" opacity="50%" />
      </div>
    </div>
  );
};
