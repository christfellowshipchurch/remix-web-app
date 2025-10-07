import { SectionTitle } from "~/components";

export function MissionSection() {
  return (
    <section id="mission" className="py-2 lg:py-24 content-padding">
      <div className="container max-w-screen-content grid items-center justify-center grid-cols-1  lg:grid-cols-5 gap-8 mx-auto">
        <SectionTitle
          sectionTitle="our mission."
          className="block md:hidden mb-[-90px]"
        />
        <div className="md:col-span-3 order-2 lg:order-1">
          <SectionTitle
            sectionTitle="our mission."
            className="hidden md:block"
          />
          <h3 className="text-[48px] md:text-5xl font-extrabold my-6 leading-tight">
            <span className="text-ocean">Everyone,</span>{" "}
            <span className="text-navy">Everyday,</span>{" "}
            <span className="text-dark-navy">Everywhere</span>
          </h3>
          <p className="text-lg text-text-secondary">
            Our mission is to help you know God and grow in your relationships
            so that you can discover your purpose and impact the world.
            <br />
            <br />
            In addition to our mission, God has given us a vision to lead a
            radical transformation for Jesus Christ in this region and beyond.
            Everyone, Everyday, Everywhere.
          </p>
        </div>
        <img
          src="/assets/images/about/mission.webp"
          alt="Mission"
          className="w-full max-w-[400px] lg:max-w-none rounded-lg lg:col-span-2 order-1 lg:order-2 md:mt-6 lg:mt-0"
        />
      </div>
    </section>
  );
}
