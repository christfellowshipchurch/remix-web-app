import InternshipsAbout from "../internships/partials/about.partial";
import InternshipsFAQs, { summerFaqs } from "../internships/partials/faq";
import DiveIn from "../internships/partials/dive-in";
import InternshipsHero from "../internships/partials/hero";
import ProgramDetails, {
  ProgramDetailsData,
} from "../internships/partials/program-details";

export { meta } from "./meta";

const programDetailsData: ProgramDetailsData[] = [
  {
    title: "Duration",
    subtitle: "12 Weeks",
    icon: "calendarAlt",
    description:
      "Full-time program running from mid-May through mid-August. Interns gain hands-on experience in various ministries throughout the church.",
  },
  {
    title: "Compensation",
    subtitle: "Stipend",
    icon: "dollar",
    description:
      "Participants receive a stipend paid in two installments during the summer, allowing you to focus on your growth and ministry experience.",
  },
  {
    title: "Housing",
    subtitle: "As-Needed Basis",
    icon: "map",
    description:
      "Complimentary housing may be provided on an as-needed basis, depending on availability. Contact us for more details.",
  },
];

export default function SummerInternshipsPage() {
  return (
    <main className="min-h-screen">
      <InternshipsHero
        subheading="Summer Internship"
        title="Experience a Summer Like Never Before"
        subtitle="Designed for college-aged young adults passionate about ministry, this hands-on experience invites you to dive into the life of our church while making a real Kingdom impact."
        ctas={[
          {
            href: "#apply-now",
            text: "Apply Now",
          },
        ]}
        imageSrc="/assets/images/internships/summer-internship.webp"
        imageAlt="Summer Internship"
      />
      <InternshipsAbout
        subheading="About the program"
        description="Interns grow spiritually, personally, and professionally through collaborative teamwork, meaningful ministry opportunities, and intentional mentorship from some of the best leaders in ministry. If you're eager to deepen your faith, develop your gifts, and thrive in a team environment, this summer could change everything."
      />

      <DiveIn
        title="Ready to Dive In?"
        paragraph="Take the first step toward a transformative summer. Apply today and discover how God wants to use you in ministry."
      />

      <InternshipsFAQs
        faqs={summerFaqs}
        sectionSubheading="FAQs"
        sectionTitle="Frequently Asked Questions"
      />
    </main>
  );
}
