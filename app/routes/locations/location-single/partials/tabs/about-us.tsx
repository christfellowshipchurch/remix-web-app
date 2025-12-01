import { OurMissionSection } from "~/routes/about/partials/mission.partial";
import { BeliefsSection } from "~/routes/about/partials/beliefs.partial";
import { ImpactSection } from "~/routes/about/partials/impact.partial";
import { ConnectWithUs } from "../../components/tabs-component/about-us/connect-with-us";
import { CampusPastorsQuote } from "../../components/tabs-component/about-us/campus-pastors-quote";

export const AboutUs = ({
  campusName,
  campusInstagram,
  campusPastor,
}: {
  campusName: string;
  campusInstagram: string;
  campusPastor: {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
}) => {
  return (
    <div className="flex flex-col w-full">
      <CampusPastorsQuote
        title="Proud to be your nearest Christ Fellowship location"
        quote="Our main worship services are on Sundays, and we also gather as a church community throughout the week, through various events, to connect, grow, and serve together. <br /> <br /> We’re honored to be a part of this community and would love for you to join us for a service this Sunday. If you’re looking for a church family nearby, it would be our pleasure to host you and get to know you."
        campusPastor={campusPastor}
      />
      <OurMissionSection />
      <BeliefsSection hideChapelImage={true} />
      <ImpactSection />
      <ConnectWithUs
        campusName={campusName || ""}
        campusInstagram={campusInstagram || ""}
      />
    </div>
  );
};
