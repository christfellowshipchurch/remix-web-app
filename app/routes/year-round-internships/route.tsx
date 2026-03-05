import InternshipsAbout from "../internships/partials/about.partial";
import InternshipsBanner from "../internships/partials/banner";
import InternshipsFAQs, { yearLongFaqs } from "../internships/partials/faq";
import DiveIn from "../internships/partials/dive-in";
import InternshipsHero from "../internships/partials/hero";
import ProgramDetails, {
  ProgramDetailsData,
} from "../internships/partials/program-details";
import InternshipsTestimonials from "../internships/partials/testimonials";
import IntenrshipFeatureSections from "../internships/partials/feature-sections";

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
  return (
    <div>
      <InternshipsHero
        subheading="College Internship · Year-Round"
        title="Equipped for Ministry Leadership"
        subtitle="A year-round opportunity designed to equip and develop students for future ministry leadership through hands-on experience, intentional mentorship, and a supportive team environment."
        ctas={[{ href: "#todo", text: "Apply Now" }]}
        imageSrc="/assets/images/internships/year-long-hero.webp"
        imageAlt="Year-Round Internships Hero"
      />
      <InternshipsAbout
        isYearLong={true}
        subheading="About the program"
        description="College interns are equipped with practical ministry skills and leadership experience that will prepare you to serve with confidence and purpose wherever God leads. You will grow personally, professionally, and spiritually while learning from experienced leaders."
      />
      <ProgramDetails data={programDetailsData} />
      <IntenrshipFeatureSections />
      <InternshipsTestimonials />
      <InternshipsBanner />
      <DiveIn />
      <InternshipsFAQs faqs={yearLongFaqs} />
    </div>
  );
}
