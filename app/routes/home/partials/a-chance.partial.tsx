import SplitScrollLayout from "../components/split-scroll-layout.component";

export function AChanceSection() {
  return (
    <section className="md:px-12 lg:px-18 w-full pt-18">
      <div className="max-w-content-padding mx-auto w-full">
        <h2 className="text-4xl font-bold w-full text-center md:block mb-20 md:mb-32 sticky top-0 z-50 pt-18">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent h-40 md:h-50 lg:h-56 xl:h-72 -z-10"></div>
          Think of it less as a chore and more{" "}
          <br className="hidden md:block lg:hidden" />
          as... <span className="text-ocean">a chance.</span>
        </h2>

        <SplitScrollLayout />
      </div>
    </section>
  );
}
