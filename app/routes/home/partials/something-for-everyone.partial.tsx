import { SectionTitle } from "~/components";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export function SomethingForEveryoneSection() {
  return (
    <section
      className="content-padding w-full pt-38 pb-23 bg-navy"
      style={{
        backgroundImage: `
          linear-gradient(180deg, #004F71 0%, rgba(0, 79, 113, 0) 36.79%),
          url('/assets/images/something-for-everyone-bg.jpg')
        `,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-screen-content mx-auto flex flex-col gap-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-full items-center justify-center flex gap-5">
              <SectionTitle sectionTitle="what we offer." />
              <div className="w-6 bg-ocean h-1" />
            </div>
            <h2 className="text-white text-center font-extrabold text-[32px] lg:text-[52px] leading-tight">
              Something For Everyone
            </h2>
          </div>
          <div></div>
        </div>

        {/* Button Section - Desktop */}
        <div className="hidden lg:block">
          <p className="text-white text-center max-w-[510px] mx-auto">
            Empowering your children and strengthening your family through
            engaging, faith-centered experiences.
          </p>
        </div>

        {/* Button Section - Mobile */}
        <div className="block lg:hidden">
          <IconButton
            iconName="arrowRight"
            className="mx-auto rounded-full border-white text-white"
            withRotatingArrow
          >
            View All Ministries
          </IconButton>
        </div>
      </div>
    </section>
  );
}
