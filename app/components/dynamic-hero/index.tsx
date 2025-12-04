import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "../breadcrumbs";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { cn } from "~/lib/utils";
import { SetAReminderModal } from "../modals/set-a-reminder/reminder-modal.component";
import { Video } from "~/primitives/video/video.primitive";

export type DynamicHeroTypes = {
  wistiaId?: string;
  imagePath?: string;
  ctas?: {
    href: string;
    title: string;
    isSetAReminder?: boolean;
    target?: string;
  }[];
  customTitle?: string;
  mobileHeight?: string;
  ipadHeight?: string;
  desktopHeight?: string;
  fullOverlay?: boolean;
};

export const DynamicHero = ({
  wistiaId,
  imagePath,
  ctas,
  customTitle,
  mobileHeight,
  ipadHeight,
  desktopHeight,
  fullOverlay = false,
}: DynamicHeroTypes) => {
  const location = useLocation();
  const pagePath =
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )[0] || "Home";

  return (
    <div
      style={{
        ["--mobile-height" as string]: mobileHeight || "720px",
        ["--ipad-height" as string]: ipadHeight || mobileHeight || "640px",
        ["--desktop-height" as string]:
          desktopHeight || ipadHeight || mobileHeight || "640px",
        ...(imagePath && { backgroundImage: `url(${imagePath})` }),
      }}
      className={cn(
        "relative flex items-center justify-start self-stretch",
        "[height:var(--mobile-height)]",
        "md:[height:var(--ipad-height)]",
        "lg:[height:var(--desktop-height)]",
        imagePath && "bg-cover bg-center bg-no-repeat",
        imagePath && "before:absolute before:inset-0 before:bg-black/50"
      )}
    >
      {/* Video if passed in */}
      <div className={"absolute size-full overflow-hidden"}>
        {wistiaId && (
          <Video
            key={`${location.pathname}-${wistiaId}`}
            wistiaId={wistiaId}
            autoPlay
            muted
            loop
          />
        )}
        {!wistiaId && imagePath && (
          <img
            src={imagePath}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Bottom Background Gradient Overlay or full overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-full z-0",
          fullOverlay
            ? "bg-black/60"
            : "bg-gradient-to-t from-black to-transparent opacity-70"
        )}
      />

      {/* Content */}
      <div
        className={cn(
          "flex flex-col w-full items-start justify-end self-stretch z-10",
          "px-5 md:px-12 lg:px-18"
        )}
      >
        <div
          className={cn(
            "w-full max-w-screen-content mx-auto flex flex-col",
            "gap-5 pb-8 md:gap-12 md:pb-16"
          )}
        >
          <h1 className="font-extrabold heading-h1 text-[3rem] md:text-[4rem] lg:text-[100px] text-white">
            {customTitle ? <HTMLRenderer html={customTitle} /> : pagePath}
          </h1>
          <div
            role="separator"
            aria-hidden="true"
            className="hidden md:block h-[2px] self-stretch bg-[#D9D9D9] opacity-50"
          />
          <div className="flex items-center justify-between self-stretch">
            {/* Breadcrumbs */}
            <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
              <div className="hidden lg:block">
                <Breadcrumbs mode="light" />
              </div>
              <div
                role="separator"
                aria-hidden="true"
                className="md:hidden h-[2px] self-stretch bg-[#D9D9D9] opacity-50"
              />
              {/* Desktop CTAs */}
              <div className="hidden lg:flex mt-5 flex-wrap justify-between gap-3 pr-1">
                {ctas?.map((cta, i) => {
                  if (cta.isSetAReminder) {
                    return (
                      <SetAReminderModal
                        key={i}
                        intent="secondary"
                        className="text-white border-[#FAFAFC] rounded-none border hover:!bg-white/10"
                      />
                    );
                  } else {
                    return (
                      <IconButton
                        key={i}
                        to={cta.href}
                        className="text-white border-[#FAFAFC] border"
                        withRotatingArrow={i === ctas.length - 1}
                        target={cta.target}
                      >
                        {cta.title}
                      </IconButton>
                    );
                  }
                })}
              </div>

              {/* Mobile CTAs */}
              <div className="lg:hidden flex flex-col-reverse md:flex-row-reverse md:justify-end gap-3 w-full pt-8 md:pt-0 md:px-0">
                {ctas?.map((cta, i) => {
                  if (cta.isSetAReminder) {
                    return (
                      <SetAReminderModal
                        key={i}
                        intent={
                          i === 0 && ctas.length > 1 ? "secondary" : "primary"
                        }
                        className={cn(
                          "w-full md:w-auto",
                          i !== 0 ? "" : "text-white border-white"
                        )}
                      />
                    );
                  } else {
                    return (
                      <Button
                        key={i}
                        intent={
                          i === 0 && ctas.length > 1 ? "secondary" : "primary"
                        }
                        href={cta.href}
                        className={`w-full md:w-auto ${
                          i !== 0 ? "" : "text-white border-white"
                        }`}
                      >
                        {cta.title}
                      </Button>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
