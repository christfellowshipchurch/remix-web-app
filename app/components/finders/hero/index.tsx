import { SectionTitle } from "~/components";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";

export const FinderHero = ({
  bgImage,
  imageLeft = false,
  sectionTitle = "life together",
  sectionTitleColor = "#0092BC",
  title,
  mobileDescription,
  desktopDescription,
  ctas,
  bgColor,
}: {
  bgColor: string;
  bgImage: string;
  imageLeft?: boolean;
  title: string;
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
  return (
    <section
      className={cn(
        "py-8 lg:h-[65vh] lg:max-h-[590px] content-padding relative",
        `bg-${bgColor}`,
      )}
    >
      <div className="container max-w-screen-content grid items-center justify-center sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 xl:gap-16 mx-auto">
        <img
          src={bgImage}
          alt="Mission"
          className={cn(
            "w-full max-w-[400px] lg:max-w-none rounded-lg lg:col-span-2 md:order-2 md:mt-6 lg:mt-0",
            imageLeft && "order-1!",
          )}
        />
        <div
          className={cn(
            "col-span-1 lg:col-span-3 md:order-1 max-w-[620px] xl:max-w-[700px] text-white",
            imageLeft && "order-2!",
          )}
        >
          <div className="absolute top-12 left-8 md:static">
            <SectionTitle
              sectionTitle={sectionTitle}
              color={sectionTitleColor}
            />
          </div>
          <HTMLRenderer
            html={title}
            className="text-[40px] md:text-5xl font-extrabold my-6"
          />
          <div className="text-lg text-white">
            <p className="hidden lg:block">{desktopDescription}</p>
            <p className="lg:hidden">{mobileDescription}</p>
          </div>
          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
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
