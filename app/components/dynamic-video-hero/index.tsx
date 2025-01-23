import Button from "~/primitives/button";
import Icon from "~/primitives/icon";
import Breadcrumbs from "../breadcrumbs";
import Video from "~/primitives/video";
import { MessageReturnType } from "~/routes/messages/message-single/loader";
import { useLoaderData } from "react-router";
import { Divider } from "~/routes/articles/partials/latest.partial";

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
    <div className="flex items-center justify-start self-stretch h-[920px] xl:h-[1000px] px-10 ">
      <div className="flex flex-col gap-12 w-full pb-16 mx-auto lg:max-w-5xl xl:max-w-6xl items-start justify-end self-stretch">
        {wistiaId ? (
          <div className="w-full">
            <Video wistiaId={wistiaId} />
          </div>
        ) : (
          video && <Video src={video} />
        )}
        <div className="flex items-center justify-between self-stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* CTAs */}
          {/* TODO: Add Share functionality when cta contains #share */}
          <div className="flex gap-6 relative pr-6 group">
            {ctas?.map((cta, i) => (
              <Button
                key={i}
                href={cta.href}
                intent="secondary"
                className="text-white border-white rounded-none hover:enabled:bg-slate-300/20"
              >
                {cta.title}
              </Button>
            ))}
            <div
              className={`${
                (ctas?.length ?? 0) < 1 ? "hidden" : ""
              } rounded-full p-3 bg-ocean absolute -right-3 top-[50%] translate-y-[-50%] rotate-[135deg] group-hover:rotate-180 transition-all duration-300`}
            >
              <Icon name="arrowBack" size={26} color="white" />
            </div>
          </div>
        </div>
        <Divider bg="#D9D9D9" opacity="50%" />
      </div>
    </div>
  );
};
