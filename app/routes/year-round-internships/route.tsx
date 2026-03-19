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
import { getImageUrl } from "~/lib/utils";

export { meta } from "./meta";

const programDetailsData: ProgramDetailsData[] = [
  {
    title: "Duration",
    subtitle: "Full Year (August – August)",
    icon: "hourglass",
    description:
      "A year-long commitment that gives you deep, sustained ministry experience and growth across multiple seasons of church life.",
  },
  {
    title: "Schedule",
    subtitle: "Part-Time · 25 hrs/week",
    icon: "calendarAlt",
    description:
      "Designed to work alongside your full-time college schedule, giving you the flexibility to balance academics and ministry.",
  },
  {
    title: "Compensation",
    subtitle: "Hourly Wage",
    icon: "dollar",
    description:
      "College interns receive an hourly wage for their work, with limited housing available on an as-needed basis.",
  },
];

export default function YearLongInternshipsPage() {
  return (
    <div>
      <InternshipsHero
        subheading="College Internship · Year-Round"
        title="Equipped for Ministry Leadership"
        subtitle="A year-round opportunity designed to equip and develop students for future ministry leadership through hands-on experience, intentional mentorship, and a supportive team environment."
        ctas={[
          {
            href: "https://job-boards.greenhouse.io/christfellowship?departments%5B%5D=4030237002",
            text: "Apply Now",
          },
        ]}
        imageSrc={getImageUrl("3141716")}
        imageAlt="Year-Round Internships Hero"
      />
      <InternshipsAbout
        isYearLong
        subheading="About the program"
        description="College interns are equipped with practical ministry skills and leadership experience that will prepare you to serve with confidence and purpose wherever God leads. You will grow personally, professionally, and spiritually while learning from experienced leaders."
      />
      <ProgramDetails data={programDetailsData} />
      <IntenrshipFeatureSections />
      <InternshipsTestimonials />
      <InternshipsBanner />
      <DiveIn ctaHref="https://job-boards.greenhouse.io/christfellowship?departments%5B%5D=4030237002" />
      <InternshipsFAQs faqs={yearLongFaqs} />
    </div>
  );
}
