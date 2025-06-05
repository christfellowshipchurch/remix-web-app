import { cn } from "~/lib/utils";
import SplitScrollLayout from "../components/split-scroll-layout.component";

export function AChanceSection() {
  return (
    <section className="relative w-full">
      <h2
        className={cn(
          "w-screen text-2xl md:text-4xl font-bold text-center text-pretty",
          "sticky lg:absolute top-0 z-49",
          "pt-28",
          "mb-20 lg:mb-32",
          "md:block",
          "px-3",
          "max-w-md md:max-w-lg lg:max-w-none mx-auto w-full"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-white via-white to-transparent -z-10",
            "h-72 md:h-72"
          )}
        ></div>
        Think of it less as a chore and more as...{" "}
        <span className="text-ocean">a chance.</span>
      </h2>
      <div className="relative" style={{ minHeight: `100vh` }}>
        <SplitScrollLayout />
      </div>
    </section>
  );
}
