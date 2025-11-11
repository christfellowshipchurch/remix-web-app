import { cn } from "~/lib/utils";
import { ImageScrollLayout } from "../components/image-scroll-layout";

export function AChanceSection() {
  return (
    <div className="relative">
      <h2
        id="a-chance-title"
        className={cn(
          "w-screen text-2xl md:text-[40px] font-extrabold text-center text-pretty",
          "fixed top-0 z-10",
          "pt-20 lg:pt-24",
          "px-10 md:px-12",
          "md:w-full"
        )}
      >
        <div
          className={cn(
            "absolute left-0 right-0 top-0 bg-gradient-to-b from-white via-white to-transparent z-[5]",
            "h-64 sm:h-72 md:h-64 lg:h-96",
            "w-screen"
          )}
        />
        <span className="relative z-20">
          Think of it less as a chore and more as...{" "}
          <span className="text-ocean">a chance.</span>
        </span>
      </h2>
      <ImageScrollLayout />
    </div>
  );
}
