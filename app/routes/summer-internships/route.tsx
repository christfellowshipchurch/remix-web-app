import InternshipsBanner from "../internships/partials/banner";
import InternshipsFAQs from "../internships/partials/faq";
import FindYourPlace from "../internships/partials/find-your-place";
import InternshipsHero from "../internships/partials/hero";
import ProgramDetails, {
  ProgramDetailsData,
} from "../internships/partials/program-details";

const programDetailsData: ProgramDetailsData[] = [
  {
    title: "Duration",
    subtitle: "12-weeks",
    icon: "bookOpenText",
    description: "12-week program (mid-May to mid-August each year)",
  },
  {
    title: "Compensation",
    subtitle: "Stipend",
    icon: "bookOpenText",
    description:
      "* Full-time (40 hrs/week), stipend program ($1000 for the summer)",
  },
  {
    title: "Housing",
    subtitle: "Provided on Needs Basis",
    icon: "bookOpenText",
    description:
      "* Housing available on an as-needed basis and based on availability",
  },
];

export default function SummerInternshipsPage() {
  const programDetailsDescription =
    "The Christ Fellowship Summer Internship Program is designed to offer ministry experience to college-aged students. Our goal is to cultivate an environment where interns can thrive under the mentorship of leaders, fostering spiritual, personal, and professional growth through collaborative teamwork and hands-on development experiences.<br /><br /> <b>* Interns must be college-aged, but do not have to be currently enrolled in college</b>";

  return (
    <div>
      <InternshipsHero isSecondary={true} />
      <ProgramDetails
        description={programDetailsDescription}
        data={programDetailsData}
      />
      <InternshipsBanner />
      <FindYourPlace />
      <InternshipsFAQs />
    </div>
  );
}
