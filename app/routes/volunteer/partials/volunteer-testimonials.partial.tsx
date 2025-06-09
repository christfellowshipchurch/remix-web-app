import { IconButton } from "~/primitives/button/icon-button.primitive";
import { WhatToExpectDesktopTabs } from "~/routes/home/components/expect-tabs.component";

export function VolunteerTestimonials() {
  return (
    <section className="w-full bg-gray py-28">
      <div className="max-w-screen-content mx-auto">
        <div className="flex flex-col justify-center items-center gap-6 padding-content text-center">
          <h2 className="heading-h4">Here from other volunteers</h2>
          <p className="text-text-secondary lg:text-text lg:text-lg text-center max-w-3xl mb-28">
            Find out what to expect at a service, how we support families, and
            what guides our faith. These videos feature everyday members sharing
            their experiences and answering your questions.
          </p>
          {/* TODO: Reuse/replace with the same component from home */}
          <WhatToExpectDesktopTabs />
          <div className="w-full flex justify-center items-center gap-4 mt-20">
            <p className="text-lg font-semibold">
              Let’s find the right fit for you. Just fill out your information,
              and we’ll help with the rest.
            </p>
            <IconButton
              to="#todo"
              withRotatingArrow
              className="bg-white border-neutral-300 text-neutral-dark rounded-full hover:enabled:bg-soft-white hover:enabled:text-neutral-dark"
            >
              Get Started
            </IconButton>
          </div>
        </div>
      </div>
    </section>
  );
}
