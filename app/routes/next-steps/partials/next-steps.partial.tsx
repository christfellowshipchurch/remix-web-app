import { LottieAnimation } from "~/components/lottie-animation";
import peopleAnimationData from "~/assets/animations/next-steps/people.json";
import barsAnimationData from "~/assets/animations/next-steps/bars.json";
import handsAnimationData from "~/assets/animations/next-steps/hands.json";

import { Button } from "~/primitives/button/button.primitive";

const nextSteps = [
  {
    title: "Join a group",
    description:
      "You weren't meant to do life alone. In fact, life is better together! No matter where you are in life or your faith, Groups help you find people to do life with and grow in your relationship with God.",
    cta: "See Groups",
    link: "/group-finder",
    animationData: peopleAnimationData,
  },
  {
    title: "Take a class",
    description:
      "From your faith to your finances, from your parenting to your purpose—there's a class for your goals! With options on-site, online, and even on-demand—everyone, everywhere can grow together.",
    cta: "See Classes",
    link: "/class-finder",
    animationData: handsAnimationData,
  },
  {
    title: "Serve with others",
    description:
      "We believe our faith in Jesus should make a difference in our world. Whether you volunteer with your campus on the Dream Team or serve your community with Missions—you can make an impact!",
    cta: "See Serving Opportunities",
    link: "/volunteer",
    animationData: barsAnimationData,
  },
];

export function NextStepsSection() {
  return (
    <section className="pb-16 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 lg:gap-12">
          {nextSteps.map((step, index) => (
            <div key={index} className="p-4 lg:p-8 text-center">
              <div className="max-w-48 mx-auto">
                <LottieAnimation animationData={step.animationData} />
              </div>
              <h3 className="heading-h4 font-bold text-text-primary mb-4">
                {step.title}
              </h3>
              <p className="text-text-secondary mb-6 leading-tight">
                {step.description}
              </p>
              <Button href={step.link} className="h-auto">
                {step.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
