import { SectionTitle } from "~/components";

export function MissionSection() {
  return (
    <section className="py-2 lg:py-24 content-padding">
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
          <h3 className="text-5xl font-bold my-6">
            <span className="text-ocean">Everyone,</span>{" "}
            <span className="text-navy">Everyday,</span>{" "}
            <span className="text-dark-navy">Everywhere</span>
          </h3>
          <p className="text-lg text-text-secondary">
            Christ Fellowship is a church in South Florida with a mission to
            take you from Soul to Soul. We believe that your relationship with
            God and your life should work together for God's glory. We believe
            that you make Northern Palm or your local home, church is wherever
            you feel Led by better person. Today is your life-time, feel free
            give me a chance to have a deeper understanding for Jesus Christ in
            your life.
          </p>
        </div>
        <img
          src="/assets/images/about/mission.webp"
          alt="Mission"
          className="w-full max-w-[400px] rounded-lg lg:col-span-2 order-1 lg:order-2"
        />
      </div>
    </section>
  );
}
