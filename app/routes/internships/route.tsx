import FeatureSections from "./partials/feature-sections";
import InternshipsHero from "./partials/hero";
import StartWithUs from "./partials/start-with-us";
import InternshipsBanner from "./partials/banner";
import FindYourPlace from "./partials/find-your-place";
import ProgramDetails, { ProgramDetailsData } from "./partials/program-details";
import InternshipsFAQs from "./partials/faq";
import InternshipsTestimonials from "./partials/testimonials";

export { meta } from "./meta";

const programDetailsData: ProgramDetailsData[] = [
  {
    title: "Duration",
    subtitle: "Semester-based",
    icon: "bookOpenText",
    description:
      "Manage your semester effectively with streamlined scheduling, automated reminders, and strategic study plans—so you can concentrate on what truly matters.",
  },
  {
    title: "Compensation",
    subtitle: "Hourly Wage",
    icon: "bookOpenText",
    description:
      "* Full-time (40 hrs/week), stipend program ($1000 for summer)",
  },
  {
    title: "Housing",
    subtitle: "Provided on Needs Basis",
    icon: "bookOpenText",
    description:
      "* Housing available on an as-needed basis and based on availability",
  },
];

export default function InternshipsPage() {
  const programDetailsDescription =
    "Applicants must be current college students with at least 60 credit hours completed and a minimum 3.0 GPA. No specific major is required—we value your skills, interests, and curiosity just as much as your field of study. Candidates should be available for the full duration of the semester-based program, demonstrate a strong desire to learn and grow in ministry, and possess excellent communication and teamwork skills. This is a paid internship with an hourly wage, and housing is provided on a needs-basis only. Students are encouraged to select their internship with respect to their major(s) and career/ministry goals.";

  return (
    <div>
      <InternshipsHero />
      <StartWithUs />
      <FeatureSections />
      <InternshipsTestimonials />
      <InternshipsBanner />
      <ProgramDetails
        description={programDetailsDescription}
        data={programDetailsData}
      />
      <FindYourPlace />
      <InternshipsFAQs />
    </div>
  );
}
