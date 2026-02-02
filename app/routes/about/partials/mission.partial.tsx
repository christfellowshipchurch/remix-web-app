import { SectionTitle } from "~/components";

export function OurMissionSection({
  isSpanish = false,
}: {
  isSpanish?: boolean;
}) {
  const missionTitle = isSpanish
    ? "Nuestra misión es ayudarte a conocer a Dios y crecer en tus relaciones para que puedas descubrir tu propósito e impactar al mundo."
    : "Our mission is to help you know God and grow in your relationships so that you can discover your purpose and impact the world.";
  const missionDescription = isSpanish
    ? "Además de nuestra misión, Dios nos ha dado la visión de liderar una transformación radical para Jesucristo en esta región y más allá. Todos Nosotros, en todo momento, en todo lugar."
    : " In addition to our mission, God has given us a vision to lead a radical transformation for Jesus Christ in this region and beyond. Everyone, Everyday, Everywhere.";

  const sectionTitle = isSpanish ? "nuestra misión." : "our mission.";

  return (
    <section id="mission" className="py-2 lg:py-24 content-padding">
      <div className="container max-w-screen-content grid items-center justify-center grid-cols-1 lg:grid-cols-5 gap-8 mx-auto">
        <SectionTitle
          sectionTitle={sectionTitle}
          className="block md:hidden mb-[-90px]"
        />
        <div className="md:col-span-3 order-2 lg:order-1 max-w-[780px]">
          <SectionTitle
            sectionTitle={sectionTitle}
            className="hidden md:block"
          />
          <h3 className="text-[48px] leading-tight md:text-5xl font-extrabold my-6">
            <span className="text-ocean">
              {isSpanish ? "Todos Nosotros" : "Everyone"},
            </span>{" "}
            <span className="text-navy">
              {isSpanish ? "En Todo Momento" : "Everyday"},
            </span>{" "}
            <span className="text-dark-navy">
              {isSpanish ? "En Todo Lugar" : "Everywhere"}
            </span>
          </h3>
          <p className="text-lg text-text-secondary">
            {missionTitle}
            <br />
            <br />
            {missionDescription}
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
