import { Breadcrumbs } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export const HeroFooter = () => {
  return (
    <div className="hidden md:block content-padding">
      <div className="max-w-screen-content mx-auto">
        <div className="h-[2px] w-full bg-[#D9D9D9] opacity-50" />
        <div className="flex flex-col md:flex-row justify-between items-center py-10">
          <Breadcrumbs mode="light" />
          <div className="mt-5 md:mt-0 flex flex-wrap justify-between gap-3 pr-1 md:pr-4 md:gap-4">
            {/* TODO: Add share functionality */}
            <IconButton
              className="text-white border-white"
              withRotatingArrow={true}
            >
              Share this episode
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
