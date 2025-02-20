import { useLocation } from "react-router";
import Breadcrumbs from "../breadcrumbs";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export type DynamicHeroTypes = {
  imagePath: string;
  ctas?: { href: string; title: string }[];
  customTitle?: string;
};

export const DynamicHero = ({
  imagePath,
  ctas,
  customTitle,
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
      className="flex items-center justify-start self-stretch h-[640px] px-5 md:px-12 lg:px-18"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 85.64%, rgba(0, 0, 0, 0.70) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 48.79%, rgba(0, 0, 0, 0.80) 100%), url(${imagePath}) lightgray 50% / cover no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col gap-12 w-full pb-16 mx-auto items-start justify-end self-stretch max-w-screen-content">
        <h1 className="font-extrabold heading-h1 lg:text-7xl xl:text-8xl text-white">
          {customTitle || pagePath}
        </h1>
        <div className="hidden md:block h-[2px] self-stretch bg-[#D9D9D9]" />
        <div className="flex items-center justify-between self-stretch">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
            <Breadcrumbs />
            <div className="md:hidden h-[2px] self-stretch bg-[#D9D9D9]" />

            {/* CTAs */}
            <div className="mt-5 md:mt-0 flex justify-between gap-3 pr-1 md:pr-4 md:gap-4">
              {ctas?.map((cta, i) => (
                <IconButton
                  key={i}
                  to={cta.href}
                  className="text-white border-white"
                  withRotatingArrow={i >= 1}
                >
                  {cta.title}
                </IconButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
