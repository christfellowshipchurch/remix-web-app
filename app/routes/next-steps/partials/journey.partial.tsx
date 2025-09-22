import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";

export function JourneySection() {
  return (
    <section className="w-full bg-gradient-to-l from-navy to-dark-navy py-32 content-padding">
      <div className="max-w-screen-content mx-auto px-4 text-white flex justify-between">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Every journey begins with <br /> a step…
        </h2>
        <div>
          <p className="mb-8 max-w-xl mx-auto">
            And your best next step to see what's here for you is the{" "}
            <strong>Journey class</strong>! In this two-part conversation,
            you'll get to know <em>a little bit</em> about Christ Fellowship and{" "}
            <em>a lot about</em> how you can know God and grow in your
            relationships so you can discover your purpose and impact the world.
          </p>
          <Button
            href="/class-finder"
            intent="secondary"
            className="border-white text-white h-auto"
          >
            Start the Journey
            <Icon name="arrowRight" />
          </Button>
        </div>
      </div>
    </section>
  );
}
