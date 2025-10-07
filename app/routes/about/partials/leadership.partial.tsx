import { cn } from "~/lib/utils";
import { LeaderGrid } from "../components/leaders-grid.component";
import { LeaderScroll } from "../components/leaders-scroll.component";
import { SectionTitle } from "~/components/section-title";

export function LeadershipSection({
  bg,
  className,
}: {
  bg?: string;
  className?: string;
}) {
  return (
    <section
      id="leadership"
      className={cn("pt-16 pb-24 lg:px-18 w-full", bg || "bg-gray", className)}
    >
      <div className="max-w-screen-content mx-auto ">
        <div className="content-padding lg:px-0 lg:flex flex-col items-start w-full lg:gap-28">
          <div className="flex flex-col gap-5 md:gap-12">
            <SectionTitle sectionTitle="our team." />
            <h3 className="text-2xl md:text-[52px] font-extrabold leading-tight max-w-3x mb-10 md:mb-0">
              Meet The Leadership Of <br />
              Christ Fellowship Church.
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
