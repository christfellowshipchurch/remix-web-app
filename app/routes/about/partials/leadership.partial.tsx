import { cn } from "~/lib/utils";
import { LeaderGrid } from "../components/leaders-grid.component";
import { LeaderScroll } from "../components/leaders-scroll.component";
import { SectionTitle } from "~/components/section-title";

export function LeadershipSection() {
  return (
    <section className="bg-gray pt-16 pb-24">
      <div className="max-w-screen-content mx-auto">
        <div className="content-padding">
          {/* Desktop title */}
          <div className="hidden lg:block">
            <SectionTitle className="mb-6" sectionTitle="our team." />
            <h3 className="text-5xl font-extrabold leading-tight mb-16 max-w-3xl">
              Meet The Passionate Leaders <br />
              Of Christ Fellowship Church.
            </h3>
          </div>
          {/* Mobile title */}
          <div className="lg:hidden">
            <SectionTitle className="mb-6" sectionTitle="meet our team." />
            <h3 className="hidden sm:block text-3xl font-extrabold leading-tight mb-16 max-w-3xl">
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
