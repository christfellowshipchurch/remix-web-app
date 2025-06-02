import { cn } from "~/lib/utils";
import SplitScrollLayout from "../components/split-scroll-layout.component";

export function AChanceSection() {
  return (
    <section className="relative w-full">
      <h2
        className={cn(
          "w-screen text-4xl font-bold text-center",
          "sticky top-0 z-49",
          "pt-8 lg:pt-28",
          "mb-20 md:mb-32",
          "md:block"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-white via-white to-transparent -z-10",
            "h-72 md:h-72"
          )}
        ></div>
        Think of it less as a chore and more{" "}
        <br className="hidden md:block lg:hidden" />
        as... <br />
        <span className="text-ocean">a chance.</span>
      </h2>
      <div className="relative" style={{ minHeight: `100vh` }}>
        <SplitScrollLayout />
      </div>
    </section>
  );
}
