import { cn } from "~/lib/utils";
import { LeaderGrid } from "../components/leaders-grid.component";
import { LeaderScroll } from "../components/leaders-scroll.component";
import { SectionTitle } from "~/components/section-title";

export function LeadershipSection({
  bg,
  className,
  layout = "horizontal",
}: {
  bg?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
}) {
  return (
    <section
      id="leadership"
      className={cn("pt-16 pb-24 lg:px-18 w-full relative z-30", bg || "bg-gray", className)}
    >
      <div className="max-w-screen-content mx-auto">
        <div className="content-padding lg:px-0 lg:flex flex-col lg:gap-28">
          {/* Desktop title */}
          <div
            className={cn(
              "hidden lg:flex",
              layout === "vertical" ? "flex-col gap-8" : "gap-24 items-center"
            )}
          >
            <SectionTitle sectionTitle="our team." />
            <h3 className="text-5xl font-extrabold leading-none max-w-3xl">
              Meet The Passionate Leaders <br />
              Of Christ Fellowship Church.
            </h3>
          </div>

          {/* Mobile title */}
          <div className="lg:hidden">
            <SectionTitle className="mb-6" sectionTitle="meet our team." />
            <h3 className="text-2xl md:text-4xl font-extrabold leading-tight mb-4 md:mb-8 max-w-3xl">
              Meet The Passionate Leaders <br />
              Of Christ Fellowship Church.
            </h3>
          </div>

          <div className="hidden lg:block">
            <LeaderGrid />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <LeaderScroll />
      </div>
    </section>
  );
}
