import { SectionTitle } from "~/components/section-title";
import {
  WhatToExpectDesktopTabs,
  WhatToExpectMobileScroll,
} from "../components/expect-tabs.component";

export function WhatToExpectSection() {
  return (
    <section
      id="what-to-expect"
      className="py-16 lg:pt-24 lg:pb-40 w-full flex flex-col gap-8 md:gap-16 md:px-12 lg:px-0 lg:pl-18 2xl:px-18"
    >
      <div className="px-6">
        <div className="container max-w-screen-content mx-auto">
          <div className="w-full flex">
            <div className="w-full flex flex-col gap-4 items-center md:gap-8">
              {/* Desktop Title */}
              <div className="flex flex-col gap-12 items-center">
                <div className="hidden lg:block">
                  <SectionTitle sectionTitle="get to know us" />
                </div>
                <h2 className="hidden lg:block lg:text-[52px] font-extrabold">
                  What to Expect
                </h2>
              </div>
              {/* Mobile Title */}
              <h2 className="lg:hidden text-2xl text-center font-extrabold">
                Get to Know Us
              </h2>

              <p className="text-text-secondary lg:text-text lg:text-lg text-center lg:text-left max-w-[650px]">
                Find out what to expect at a service, how we support families,
                and what guides our faith. These videos feature everyday members
                sharing their experiences and answering your questions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="w-full hidden lg:block">
        <div className="max-w-screen-content mx-auto">
          <WhatToExpectDesktopTabs />
        </div>
      </div>

      {/* Mobile Scroll */}
      <WhatToExpectMobileScroll />
    </section>
  );
}
