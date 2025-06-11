import { useRef, useState, useEffect } from "react";
import { SectionTitle } from "~/components";
import { Icon } from "~/primitives/icon/icon";

interface Step {
  title: string;
  subtitle: string;
  mobileDescription: string;
  desktopDescription: string;
}

const steps: Step[] = [
  {
    title: "1st Step",
    subtitle: "Volunteer Application:",
    mobileDescription:
      "Complete a Volunteer Application for your desired role. If unsure, select 'Help me' and we'll assist you.",
    desktopDescription:
      "Start by completing a Volunteer Application for the role you’re interested in. If you aren't sure which team, no problem! Fill out the application, select 'Not Sure Yet?' and someone will contact you to help you decide.",
  },
  {
    title: "2nd Step",
    subtitle: "Get-to-Know-You Conversation:",
    mobileDescription:
      "You'll meet with a team leader to discuss the role and see if it's a good fit for you and the team.",
    desktopDescription:
      "You’ll have the chance to sit with a team leader for a conversation. This is an opportunity to explore the role you’re interested in and see if it’s the right fit for both you and the team.",
  },
  {
    title: "3rd Step",
    subtitle: "Background Check:",
    mobileDescription:
      "If you're over 18, you'll need to consent to a background check, which requires your social security number. This is mandatory for all volunteers to ensure everyone's safety.",
    desktopDescription:
      "If you’re over 18, the application will include a background check consent form that requires a social security number. A national background check is required for all volunteers to ensure your safety and well-being, as well as that of our church family.",
  },
  {
    title: "4th Step",
    subtitle: "Equipping:",
    mobileDescription:
      "In this onboarding session, you'll learn what it means to be part of our Dream Team and how to thrive in our 'Welcome Home' environment.",
    desktopDescription:
      "During this step of the onboarding process, you will discover what it means to be part of our Dream Team and be equipped to flourish as we partner to impact our world. In this hour-long session, you'll learn how to live out our values and contribute to our 'Welcome Home' environment.",
  },
];

function OnboardingMobile() {
  return (
    <div className="md:hidden bg-dark-navy w-full min-h-screen flex flex-col px-6 py-24">
      <SectionTitle sectionTitle="how it works." className="mb-2 text-ocean" />
      <h2 className="text-white text-4xl font-extrabold mb-16 leading-tight">
        Onboarding <br /> Process
      </h2>
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-8 text-white">
            {/* Timeline + Icon */}
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ocean mb-2">
                <Icon name="check" color="white" size={28} />
              </span>
              {/* Vertical line except for last step */}
              {i < steps.length - 1 && (
                <span
                  className="w-1 h-full flex-1 bg-ocean/30"
                  style={{ minHeight: 48 }}
                />
              )}
            </div>
            {/* Step Content */}
            <div className="flex-1 pb-8">
              <h3 className="text-2xl font-extrabold mb-3">{step.title}</h3>
              <div className="font-bold mb-3">{step.subtitle}</div>
              <p className="text-white/60 text-base leading-relaxed">
                {step.mobileDescription}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OnboardingProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIdx, setCenterIdx] = useState(0);

  // Detect which step is centered (desktop only)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const children = Array.from(container.children) as HTMLDivElement[];
      const containerRect = container.getBoundingClientRect();
      let minDiff = Infinity;
      let idx = 0;
      children.forEach((child, i) => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.top + rect.height / 2;
        const containerCenter = containerRect.top + containerRect.height / 2;
        const diff = Math.abs(childCenter - containerCenter);
        if (diff < minDiff) {
          minDiff = diff;
          idx = i;
        }
      });
      setCenterIdx(idx);
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <OnboardingMobile />
      <section className="w-full bg-navy content-padding hidden md:block">
        <div className="max-w-screen-content mx-auto">
          {/* Mobile Layout */}
          {/* Desktop Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="flex flex-col py-28 gap-6">
              <SectionTitle sectionTitle="how it works." />
              <h2 className="heading-h2 text-white">Onboarding Process</h2>
            </div>
            {/* Right Side: Scrollable Steps */}
            <div
              ref={containerRef}
              className="h-[560px] overflow-y-auto snap-y snap-mandatory gap-8 pr-2 no-scrollbar rounded-lg pt-10 pb-10 hidden md:block"
              style={{
                scrollBehavior: "smooth",
                scrollPaddingTop: "120px", // (560 - stepHeight) / 2
                scrollPaddingBottom: "120px",
              }}
              aria-label="Onboarding Steps"
            >
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className={`min-h-[320px] max-h-[320px] py-10 text-white snap-center flex items-start transition-opacity duration-300 ${
                    centerIdx === i ? "opacity-100" : "opacity-50"
                  }`}
                  tabIndex={0}
                  aria-current={centerIdx === i}
                >
                  <div className="flex-shrink-0 mt-2 mr-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-ocean">
                      <Icon name="check" color="white" size={28} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-5">
                    <h3 className="text-5xl font-extrabold">{step.title}</h3>
                    <div className="font-bold text-lg">{step.subtitle}</div>
                    <p className="text-lg text-white/80">
                      {step.desktopDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
