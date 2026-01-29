import { OurMissionSection } from "~/routes/about/partials/mission.partial";
import { BeliefsSection } from "~/routes/about/partials/beliefs.partial";
import { ImpactSection } from "~/routes/about/partials/impact.partial";
import { CampusPastorsQuote } from "../../components/tabs-component/about-us/campus-pastors-quote";

export const AboutUs = ({
  campusPastor,
  isSpanish,
}: {
  campusPastor: {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  isSpanish?: boolean;
}) => {
  const pastorTitle = isSpanish
    ? "Orgullosos de ser tu campus de Christ Fellowship más cercano"
    : "Proud to be your nearest Christ Fellowship location";
  const pastorQuote = isSpanish
    ? "Nuestros servicios principales de adoración son los domingos, y también nos reunimos como comunidad durante la semana a través de distintos eventos para conectar, crecer y servir juntos. Es un honor ser parte de esta comunidad y nos alegraría que nos acompañes en un servicio este domingo. Si estás buscando una iglesia cerca de ti, será un gusto recibirte, conocerte y caminar contigo."
    : "Our main worship services are on Sundays, and we also gather as a church community throughout the week, through various events, to connect, grow, and serve together. <br /> <br /> We’re honored to be a part of this community and would love for you to join us for a service this Sunday. If you’re looking for a church family nearby, it would be our pleasure to host you and get to know you.";

  return (
    <div className="flex flex-col w-full">
      <CampusPastorsQuote
        campusPastor={campusPastor}
        isSpanish={isSpanish}
        quote={pastorQuote}
        title={pastorTitle}
      />
      <OurMissionSection isSpanish={isSpanish} />
      <BeliefsSection hideChapelImage={true} isSpanish={isSpanish} />
      <ImpactSection isSpanish={isSpanish} />
    </div>
  );
};
