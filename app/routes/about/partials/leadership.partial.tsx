import { cn } from "~/lib/utils";
import { LeaderGrid } from "../components/leaders-grid.component";
import { LeaderScroll } from "../components/leaders-scroll.component";
import { SectionTitle } from "~/components/section-title";

export function LeadershipSection({ bg }: { bg?: string }) {
  return (
    <section
      id="leadership"
      className={cn("pt-16 pb-24 lg:px-18 w-full", bg || "bg-gray")}
    >
      <div className="max-w-screen-content mx-auto ">
        <div className="content-padding lg:px-0 lg:flex flex-col lg:gap-28">
          {/* Desktop title */}
          <div className="hidden lg:flex gap-24 items-center">
            <SectionTitle sectionTitle="our team." />
            <h3 className="text-5xl font-extrabold leading-none max-w-3xl">
              Meet The Passionate Leaders <br />
              Of Christ Fellowship Church.
            </h3>
          </div>

          {/* Mobile title */}
          <div className="lg:hidden">
            <SectionTitle className="mb-6" sectionTitle="meet our team." />
            <h3 className="hidden sm:block text-[28px] sm:text-5xl font-extrabold leading-tight mb-16 max-w-3xl">
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
