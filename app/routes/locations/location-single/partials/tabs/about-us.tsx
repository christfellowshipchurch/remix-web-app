import { MissionSection } from "~/routes/about/partials/mission.partial";
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
        quote="We gather together as a church community throughout the week for various opportunities to connect, grow, and serve (though our main worship gathering is on Sunday). Here you can find information on our different ministries, small groups, upcoming events, and ways to get involved. We're honored to be a part of this community and would love for you to join us as we live out our faith together. If you're looking for a church family nearby, it's our pleasure to connect with you."
        campusPastor={campusPastor}
      />
      <MissionSection />
      <BeliefsSection />
      <ImpactSection />
      <ConnectWithUs
        campusName={campusName || ""}
        campusInstagram={campusInstagram || ""}
      />
    </div>
  );
};
