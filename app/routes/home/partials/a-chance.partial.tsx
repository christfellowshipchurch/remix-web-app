import { cn } from "~/lib/utils";
import { SnapScrollLayout } from "../components/snap-scroll-layout";

export function AChanceSection() {
  return (
    <>
      <h2
        id="a-chance-title"
        className={cn(
          "w-screen text-2xl md:text-[40px] font-extrabold text-center text-pretty",
          "sticky lg:absolute top-0 -z-20",
          "pt-10 md:pt-12 lg:pt-28",
          "mb-20 lg:mb-32",
          "md:block",
          "px-3",
          "max-w-md md:max-w-lg lg:max-w-none mx-auto w-full"
        )}
      >
        <div
          className={cn(
            "fixed left-0 right-0 top-0 bg-gradient-to-b from-white via-white to-transparent -z-10",
            "h-36 sm:h-72 md:h-96"
          )}
        ></div>
        Think of it less as a chore and more as...{" "}
        <span className="text-ocean">a chance.</span>
      </h2>
      <SnapScrollLayout />
    </>
  );
}
