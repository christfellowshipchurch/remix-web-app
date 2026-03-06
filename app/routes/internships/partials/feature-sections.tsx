import InternshipFeatureSection from "../components/internship-feature-section";

const IntenrshipFeatureSections = () => {
  return (
    <div className="content-padding w-full py-16 md:py-24">
      <div className="flex flex-col gap-10 md:gap-24 items-center max-w-[1120px] mx-auto w-full">
        <InternshipFeatureSection
          title="Mentorship"
          description="Work closely with experienced leaders who will guide and invest in your personal growth."
          images={["/assets/images/internships/m.webp"]}
        />
        <InternshipFeatureSection
          title="Community"
          description="Build lasting relationships with other interns and become part of a supportive community."
          images={[
            "/assets/images/internships/c-1.webp",
            "/assets/images/internships/c-2.webp",
          ]}
          imageRight={true}
        />
        <InternshipFeatureSection
          title="Practical Experience"
          description="Apply your skills in a dynamic environment and make a real impact from day one."
          images={[
            "/assets/images/internships/pe-1.webp",
            "/assets/images/internships/pe-2.webp",
          ]}
        />
        <InternshipFeatureSection
          title="Leadership Development"
          description="Gain hands-on experience in leadership and team management through real-world projects."
          images={["/assets/images/internships/led-dev.webp"]}
          imageRight={true}
        />
      </div>
    </div>
  );
};

export default IntenrshipFeatureSections;
