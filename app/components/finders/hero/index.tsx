import { SectionTitle } from "~/components";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";

export type FinderHeroBgColor = "ocean" | "navy" | "white";

export const FinderHero = ({
  bgImage,
  imageAlt = "Find Community",
  imageLeft = false,
  sectionTitle,
  sectionTitleColor = "#0092BC",
  title,
  topic,
  mobileDescription,
  desktopDescription,
  ctas,
  bgColor,
}: {
  bgColor: FinderHeroBgColor;
  bgImage: string;
  imageAlt?: string;
  imageLeft?: boolean;
  title: string;
  /** Optional pill below the title (e.g. class topic).
   * - This will also be used to determine if its a class single page or not. - which lays things out a little differently. */
  topic?: string;
  /** When omitted or empty, the eyebrow is not rendered. */
  sectionTitle?: string;
  sectionTitleColor?: string;
  mobileDescription: string;
  desktopDescription: string;
  ctas?: {
    href: string;
    title: string;
    className?: string;
    intent: "primary" | "secondary" | "white" | "secondaryWhite";
  }[];
}) => {
  const trimmedSectionTitle = sectionTitle?.trim() ?? "";
  const showSectionTitle = trimmedSectionTitle.length > 0;
  const onLightBg = bgColor === "white";

  return (
    <section
      className={cn(
        "relative content-padding pt-8 pb-12 md:pb-8 lg:h-[65vh] lg:max-h-[590px]",
        bgColor === "ocean" && "bg-ocean",
        bgColor === "navy" && "bg-navy",
        bgColor === "white" && "bg-white",
      )}
    >
      <div className="container mx-auto grid max-w-screen-content items-center justify-center gap-10 sm:grid-cols-2 md:gap-8 lg:grid-cols-5 xl:gap-16">
        <img
          src={bgImage}
          alt={imageAlt}
          className={cn(
            "w-full max-w-[400px] lg:max-w-none lg:col-span-2 md:order-2 md:mt-6 lg:mt-0",
            imageLeft && "order-1!",
            topic ? "rounded-xl" : "rounded-lg",
          )}
        />

        <div
          className={cn(
            "col-span-1 max-w-[620px] md:order-1 lg:col-span-3 xl:max-w-[700px]",
            onLightBg ? "text-text-primary" : "text-white",
            imageLeft && "order-2!",
          )}
        >
          {showSectionTitle ? (
            <div className="absolute top-12 left-8 md:static">
              <SectionTitle
                sectionTitle={trimmedSectionTitle}
                color={sectionTitleColor}
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            {topic ? (
              <span
                className={cn(
                  "mt-2 inline-flex w-fit rounded-sm px-2 py-1 text-sm",
                  onLightBg
                    ? "bg-gray-100 text-text-primary"
                    : "bg-white/15 text-white",
                )}
              >
                {topic}
              </span>
            ) : null}
            <HTMLRenderer
              html={title}
              className={cn(
                "font-extrabold md:my-6 md:text-[52px]",
                onLightBg && "text-text-primary",
                topic ? "text-[32px]" : "text-[40px]",
              )}
            />
            {topic && ctas && ctas.length > 0 && (
              <div className="md:hidden mt-1 flex flex-wrap gap-4">
                {ctas.map((cta, index) => (
                  <Button
                    key={index}
                    intent={cta.intent}
                    className={cta.className}
                    href={cta.href}
                  >
                    {cta.title}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div
            className={cn(
              "text-lg",
              onLightBg ? "text-text-primary" : "text-white",
              topic ? "mt-12 md:mt-8" : "",
            )}
          >
            <HTMLRenderer
              html={desktopDescription}
              className={cn(
                "hidden lg:block",
                onLightBg
                  ? "html-renderer--finder-hero-desc-light"
                  : "html-renderer--finder-hero-desc",
              )}
            />
            <HTMLRenderer
              html={mobileDescription}
              className={cn(
                "lg:hidden",
                onLightBg
                  ? "html-renderer--finder-hero-desc-light"
                  : "html-renderer--finder-hero-desc",
              )}
            />
          </div>
          {ctas && ctas.length > 0 && (
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-4",
                topic ? "hidden lg:flex" : "",
              )}
            >
              {ctas.map((cta, index) => (
                <Button
                  key={index}
                  intent={cta.intent}
                  className={cta.className}
                  href={cta.href}
                >
                  {cta.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
