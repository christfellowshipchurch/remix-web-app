import InternshipFeatureSection from "../components/internship-feature-section";

const FeatureSections = () => {
  return (
    <div className="content-padding w-full">
      <div className="flex flex-col items-center max-w-screen-content mx-auto w-full">
        <InternshipFeatureSection
          title="Mentorship"
          description="Work closely with experienced leaders who will guide and invest in your personal growth."
          images={["/assets/images/internships/m.webp"]}
          imageRight={true}
          alignRight={true}
        />
        <InternshipFeatureSection
          title="Community"
          description="Build lasting relationships with other interns and become part of a supportive community."
          images={[
            "/assets/images/internships/c-1.webp",
            "/assets/images/internships/c-2.webp",
          ]}
        />
        <InternshipFeatureSection
          title="Practical Experience"
          description="Apply your skills in a dynamic environment and make a real impact from day one."
          images={[
            "/assets/images/internships/pe-1.webp",
            "/assets/images/internships/pe-2.webp",
          ]}
          imageRight={true}
          alignRight={true}
        />
        <InternshipFeatureSection
          title="Leadership Development"
          description="Gain hands-on experience in leadership and team management through real-world projects."
          images={["/assets/images/internships/led-dev.webp"]}
        />
      </div>
    </div>
  );
};

export default FeatureSections;
