import { SectionTitle } from "~/components/section-title";
import {
  WhatToExpectDesktopTabs,
  WhatToExpectMobileScroll,
} from "../components/expect-tabs.component";

export function WhatToExpectSection() {
  return (
    <section
      id="what-to-expect"
      className="py-16 lg:pt-24 lg:pb-40 w-full flex flex-col gap-8 md:gap-16 md:px-12 lg:px-0 lg:pl-18 2xl:px-18 bg-white"
    >
      <div className="px-6">
        <div className="container max-w-screen-content mx-auto">
          <div className="w-full flex">
            <div className="w-full flex flex-col gap-4 items-center lg:items-start md:gap-8">
              {/* Desktop Title */}
              <div className="flex flex-col gap-12">
                <div className="hidden lg:block">
                  <SectionTitle sectionTitle="get to know us." />
                </div>
                <h2 className="hidden lg:block lg:text-[52px] font-extrabold">
                  What to Expect
                </h2>
              </div>
              {/* Mobile Title */}
              <h2 className="lg:hidden text-2xl text-center font-extrabold">
                What to Expect
              </h2>

              <p className="text-text-secondary lg:text-text lg:text-lg text-center lg:text-left max-w-[650px]">
                Here at Christ Fellowship Church, you can expect to experience
                church services with uplifting worship music, encouraging
                messages from our pastors, special programming for your family,
                and opportunities for you to find people to do life with all
                throughout the week.
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
