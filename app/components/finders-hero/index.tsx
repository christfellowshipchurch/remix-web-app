import { Button } from "~/primitives/button/button.primitive";
import { SectionTitle } from "../section-title";
import { cn, getImageUrl } from "~/lib/utils";

interface FindersHeroProps {
  title: string;
  sectionTitle: string;
  subtitle: string;
  mobileSubtitle?: string;
  imageRight?: boolean;
  image?: string;
  imageAlt?: string;
  rockImageId?: string; // Rock Image Id
  button?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
}

const FindersHero = ({
  title,
  sectionTitle,
  subtitle,
  mobileSubtitle,
  imageRight = false,
  image,
  imageAlt,
  rockImageId,
  button,
  secondaryButton,
}: FindersHeroProps) => {
  return (
    <section className="py-2 lg:pt-12 xl:pt-20 lg:h-[65vh] lg:max-h-[650px] content-padding">
      <div
        className={cn(
          "container max-w-screen-content grid items-center justify-center sm:grid-cols-2 lg:grid-cols-5 gap-16 md:gap-8 mx-auto",
        )}
      >
        <img
          src={rockImageId ? getImageUrl(rockImageId) : image}
          alt={imageAlt || "Hero"}
          className={cn(
            "w-full max-w-[400px] lg:max-w-none rounded-lg lg:col-span-2 md:mt-6 lg:mt-0",
            imageRight ? "order-2" : "order-1",
          )}
        />
        <div
          className={cn(
            "col-span-1 lg:col-span-3 pt-8",
            imageRight ? "order-1" : "order-2",
          )}
        >
          <SectionTitle sectionTitle={sectionTitle} />
          <h3 className="text-[40px] md:text-5xl font-extrabold my-6">
            {title}
          </h3>
          <div className="text-lg text-text-secondary">
            <p className="hidden lg:block">{subtitle}</p>
            <p className="lg:hidden">{mobileSubtitle || subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            {secondaryButton && (
              <Button
                intent="secondary"
                className="hidden md:block text-base font-normal"
                href={secondaryButton.href}
              >
                {secondaryButton.text}
              </Button>
            )}
            {button && (
              <Button className="text-base font-normal" href={button.href}>
                {button.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindersHero;
