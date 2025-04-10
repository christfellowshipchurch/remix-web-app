import { useLocation } from "react-router";
import { Breadcrumbs } from "../breadcrumbs";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import { Button } from "~/primitives/button/button.primitive";

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
      className="flex items-center justify-start self-stretch h-[720px] md:h-[640px] px-5 md:px-12 lg:px-18"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${imagePath}) black 50% / cover no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col gap-8 md:gap-12 w-full pb-8 md:pb-16 mx-auto items-start justify-end self-stretch max-w-screen-content">
        <h1 className="font-extrabold heading-h1 lg:text-7xl xl:text-8xl text-white">
          {customTitle || pagePath}
        </h1>
        <div className="hidden md:block h-[2px] self-stretch bg-[#D9D9D9] opacity-50" />
        <div className="flex items-center justify-between self-stretch">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
            <div className="hidden lg:block">
              <Breadcrumbs />
            </div>
            <div className="md:hidden h-[2px] self-stretch bg-[#D9D9D9]" />

            {/* Desktop CTAs */}
            <div className="hidden lg:flex mt-5 flex-wrap justify-between gap-3 pr-1">
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
        </div>
      </div>
    </div>
  );
};
