import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";
import heroBgImgStyles from "~/styles/hero-bg-image-styles";

export const EventsSingleHero = ({
  imagePath,
  ctas,
  customTitle,
}: {
  imagePath: string;
  ctas: { title: string; href: string }[];
  customTitle?: string;
}) => {
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
    <div style={heroBgImgStyles(imagePath)} className="w-full">
      <div className="flex items-center px-5 md:px-12 lg:px-18 w-full bg-white/80 backdrop-blur-lg justify-start self-stretch py-8 md:pb-12 md:pt-20">
        <div className="flex flex-col w-full mx-auto items-start justify-end self-stretch max-w-screen-content">
          <img
            src={imagePath}
            alt={customTitle || pagePath}
            className="w-full aspect-[2/1] object-cover"
          />
          <h1 className="font-extrabold heading-h4 md:heading-h2 lg:text-[52px] text-text-primary leading-tight !text-pretty my-3 md:my-8">
            {customTitle || pagePath}
          </h1>
          <div className="hidden md:block h-[2px] self-stretch bg-neutral-400 opacity-50 mb-8" />
          <div className="flex items-center justify-between self-stretch">
            {/* Breadcrumbs */}
            <div className="flex flex-col gap-3 w-full md:px-0 md:flex-row md:items-center md:justify-between md:gap-0">
              <Breadcrumbs mode="dark" />
              <div className="md:hidden h-[2px] self-stretch bg-neutral-400 opacity-50 mt-16" />

              {/* CTAs */}
              <div className="mt-5 md:mt-0 flex flex-wrap sm:justify-start gap-6">
                {ctas?.map((cta, i) => (
                  <IconButton
                    key={i}
                    to={cta.href}
                    className="text-navy border-navy hover:enabled:text-ocean hover:enabled:border-ocean"
                    withRotatingArrow={i === ctas.length - 1}
                  >
                    {cta.title}
                  </IconButton>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
