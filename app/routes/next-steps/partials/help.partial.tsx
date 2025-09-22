import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

export function HelpSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

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
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate scale based on scroll progress
  const scale = 1 + scrollProgress * 0.3; // Grows up to 30% larger
  const opacity = Math.min(1, scrollProgress * 2); // Fade in as it grows

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-gray-50">
      <div
        className={cn([
          "max-w-4xl",
          "mx-auto",
          "px-4",
          "text-center",
          "bg-[url('https://cloudfront.christfellowship.church/GetImage.ashx?id=3063943')]",
          "bg-cover",
          "bg-center",
          "py-16",
          "rounded-lg",
        ])}
      >
        <div
          className={cn([
            "w-[350px]",
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
          <h2 className="text-3xl font-serif font-bold mb-6">
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
    </section>
  );
}
