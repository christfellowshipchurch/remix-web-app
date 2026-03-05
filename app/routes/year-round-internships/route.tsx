import InternshipsAbout from "../internships/partials/about.partial";
import InternshipsBanner from "../internships/partials/banner";
import InternshipsFAQs, { yearLongFaqs } from "../internships/partials/faq";
import DiveIn from "../internships/partials/dive-in";
import InternshipsHero from "../internships/partials/hero";
import ProgramDetails, {
  ProgramDetailsData,
} from "../internships/partials/program-details";

export { meta } from "./meta";

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

export default function YearLongInternshipsPage() {
  const programDetailsDescription =
    "The Christ Fellowship Summer Internship Program is designed to offer ministry experience to college-aged students. Our goal is to cultivate an environment where interns can thrive under the mentorship of leaders, fostering spiritual, personal, and professional growth through collaborative teamwork and hands-on development experiences.<br /><br /> <b>* Interns must be college-aged, but do not have to be currently enrolled in college</b>";

  return (
    <div>
      <InternshipsHero
        subheading="Year-Round Internships"
        title="Grow Your Ministry Career with Us"
        subtitle="Year-Round Internships"
        ctas={[{ href: "#todo", text: "Apply Now" }]}
        imageSrc="/assets/images/internships/year-round-internships.webp"
        imageAlt="Year-Round Internships Hero"
      />
      <InternshipsAbout
        isYearLong={true}
        subheading="About the program"
        description="College interns are equipped with practical ministry skills and leadership experience that will prepare you to serve with confidence and purpose wherever God leads. You will grow personally, professionally, and spiritually while learning from experienced leaders."
      />
      <ProgramDetails
        description={programDetailsDescription}
        data={programDetailsData}
      />
      <InternshipsBanner />
      <DiveIn />
      <InternshipsFAQs faqs={yearLongFaqs} />
    </div>
  );
}
