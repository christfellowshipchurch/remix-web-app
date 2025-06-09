import { SectionTitle } from "~/components";
import { Button } from "~/primitives/button/button.primitive";

export const GroupFinderHero = () => {
  return (
    <section className="py-2 lg:pt-24 content-padding">
      <div className="container max-w-screen-content grid items-center justify-center grid-cols-1 lg:grid-cols-5 gap-16 md:gap-8 mx-auto">
        <img
          src="/assets/images/groups-hero.webp"
          alt="Mission"
          className="w-full max-w-[400px] lg:max-w-none rounded-lg lg:col-span-2 order-2 md:mt-6 lg:mt-0"
        />
        <div className="md:col-span-3 order-1 pt-8">
          <SectionTitle sectionTitle="life together" />
          <h3 className="text-[40px] md:text-5xl font-extrabold my-6">
            Find Your Group <span className="hidden md:inline">Today</span>
          </h3>
          <div className="text-lg text-text-secondary">
            <p className="hidden md:block">
              Christ Fellowship is a church in South Florida with a passion to
              help you know God and grow in your relationships so that you can
              discover your purpose and impact the world. We believe that church
              isn’t just a building you walk into, but a family you can belong
              to—so whether you call one of our many locations home or join from
              home, church is wherever you are! Led by senior pastors Todd &
              Julie Mullins, God has given us a vision to lead a radical
              transformation for Jesus Christ in this region and beyond.
              Everyone, Everyday, Everywhere.
            </p>
            <p className="md:hidden">
              Christ Fellowship is a church in South Florida with a passion to
              help you know God and grow in your relationships so that you can
              discover your purpose
            </p>
          </div>
          <div className="flex gap-4 mt-8">
            <Button
              intent="secondary"
              className="hidden md:block text-base font-normal"
            >
              Help me to find a group
            </Button>
            <Button
              intent="secondary"
              className="md:hidden text-base font-normal"
            >
              Contact Us
            </Button>
            <Button className="text-base font-normal">Lead a group</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
