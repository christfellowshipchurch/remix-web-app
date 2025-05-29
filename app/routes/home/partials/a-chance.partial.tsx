import { cn } from "~/lib/utils";
import SplitScrollLayout from "../components/split-scroll-layout.component";

export function AChanceSection() {
  return (
    <section className="md:px-12 lg:px-18 w-full pt-18">
      <div className="max-w-content-padding mx-auto w-full">
        <h2 className="text-4xl font-bold w-full text-center md:block mb-20 md:mb-32 sticky top-0 z-49 pt-28">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b from-white via-white to-transparent -z-10",
              "h-96 md:h-72"
            )}
          ></div>
          Think of it less as a chore and more{" "}
          <br className="hidden md:block lg:hidden" />
          as... <span className="text-ocean">a chance.</span>
        </h2>

        <SplitScrollLayout />
      </div>
    </section>
  );
}
