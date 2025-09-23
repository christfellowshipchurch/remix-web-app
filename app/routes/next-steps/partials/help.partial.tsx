import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { getImageUrl } from "~/lib/utils";
import { useResponsive } from "~/hooks/use-responsive";

export function HelpSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isXSmall } = useResponsive();

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;

        // Calculate scroll progress (0 to 1)
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - rect.top) / (windowHeight + elementHeight)
          )
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate scale based on scroll progress
  const scale = 1 + scrollProgress * 0.3; // Grows up to 30% larger
  const opacity = Math.min(1, scrollProgress * 2); // Fade in as it grows

  // BG Images
  const mobileBgImage = getImageUrl("3064840");
  const desktopBgImage = getImageUrl("3063943");

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-gray-50 px-6">
      <div
        className={cn([
          "max-w-sm",
          "sm:max-w-4xl",
          "mx-auto",
          "text-center",
          "bg-cover",
          "bg-center",
          "rounded-xl",
          "overflow-hidden",
          "relative",
          "aspect-[3/6]",
          "sm:aspect-[16/10]",
          "md:aspect-video",
        ])}
        style={{
          backgroundImage: `url(${isXSmall ? mobileBgImage : desktopBgImage})`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div
            className={cn([
              "w-[280px]",
              "md:w-[350px]",
              "h-[200px]",
              "mx-auto",
              "bg-[url('assets/images/next-steps/help-text.png')]",
              "py-10",
              "bg-contain",
              "bg-no-repeat",
              "bg-center",
              "flex",
              "items-center",
              "justify-center",
              "transition-all",
              "duration-300",
              "ease-out",
            ])}
            style={{
              transform: `scale(${scale})`,
              opacity: opacity,
            }}
          >
            <h2 className="text-2xl md:text-3xl font-serif mb-6">
              We're here
              <br />
              to help
            </h2>
          </div>
          <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Not sure where to start? Answer a few simple questions and we'll get
            you connected!
          </p>
          <Button href="/connect-card">Get Connected</Button>
        </div>
      </div>
    </section>
  );
}
