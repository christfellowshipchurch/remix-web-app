import InternshipFeatureSection from "../components/internship-feature-section";

const FeatureSections = () => {
  return (
    <div className="content-padding w-full">
      <div className="flex flex-col items-center max-w-screen-content mx-auto w-full">
        <InternshipFeatureSection
          title="Leadership Development"
          description="Gain hands-on experience in leadership and team management through real-world projects."
          image="/assets/images/internships/leadership.webp"
        />
        <InternshipFeatureSection
          title="Mentorship"
          description="Work closely with experienced leaders who will guide and invest in your personal growth."
          image="/assets/images/internships/mentorship.webp"
          imageRight={true}
          alignRight={true}
        />
        <InternshipFeatureSection
          title="Community"
          description="Build lasting relationships with other interns and become part of a supportive community."
          image="/assets/images/internships/community.webp"
        />
        <InternshipFeatureSection
          title="Practical Experience"
          description="Apply your skills in a dynamic environment and make a real impact from day one."
          image="/assets/images/internships/practical.webp"
          imageRight={true}
          alignRight={true}
        />
      </div>
    </div>
  );
};

export default FeatureSections;
