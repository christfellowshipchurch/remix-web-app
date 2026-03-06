import { getImageUrl } from "~/lib/utils";
import InternshipFeatureSection from "../components/internship-feature-section";

const IntenrshipFeatureSections = () => {
  return (
    <div className="content-padding w-full py-16 md:py-24">
      <div className="flex flex-col gap-10 md:gap-24 items-center max-w-[1120px] mx-auto w-full">
        <InternshipFeatureSection
          title="Mentorship"
          description="Work closely with experienced leaders who will guide and invest in your personal growth."
          images={[getImageUrl("3141723")]}
        />
        <InternshipFeatureSection
          title="Community"
          description="Build lasting relationships with other interns and become part of a supportive community."
          images={[getImageUrl("3141717"), getImageUrl("3141718")]}
          imageRight={true}
        />
        <InternshipFeatureSection
          title="Practical Experience"
          description="Apply your skills in a dynamic environment and make a real impact from day one."
          images={[getImageUrl("3141724"), getImageUrl("3141725")]}
        />
        <InternshipFeatureSection
          title="Leadership Development"
          description="Gain hands-on experience in leadership and team management through real-world projects."
          images={[getImageUrl("3141719")]}
          imageRight={true}
        />
      </div>
    </div>
  );
};

export default IntenrshipFeatureSections;
