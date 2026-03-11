import { StyledAccordion } from "~/components";

export const summerFaqs = [
  {
    title: "Do I have to be enrolled in college to be a Summer Intern?",
    content:
      "No, however you must have a high school diploma and be at least one year removed from high school.",
  },
  {
    title: "Is the Summer Internship paid?",
    content:
      "Our interns receive a stipend for their summer with us. All interns receive the stipend in the form of two payments during the summer.",
  },
  {
    title: "Do I need a certain major to be considered for an internship?",
    content:
      "No. We are just as concerned with your skills, interests, and curiosity as we are with your major. Students are encouraged to select their internship with respect to their major(s) and career/ministry goals.",
  },
  {
    title: "Once I complete an internship, is it possible to do another?",
    content:
      "Absolutely! You are welcome to reapply for internships in the future, including another Summer Internship or a year-long College Internship, as long as you meet the required qualifications.",
  },
  {
    title: "What if I need housing?",
    content:
      "Housing may be available for interns based on individual need and availability.",
  },
  {
    title: "Do you provide transportation or travel costs?",
    content:
      "No. You will be responsible for any costs associated with getting here or returning to your current location. You are also responsible for transportation to and from work each day.",
  },
];

export const yearLongFaqs = [
  {
    title: "Do I have to be enrolled in college to be a College Intern?",
    content:
      "Yes, you must be enrolled as a full-time college student and have at least 60 credit hours completed along with a 3.0 GPA. ",
  },
  {
    title: "Are college interns paid?",
    content: "Yes. Our interns receive an hourly wage.",
  },
  {
    title: "What ministries are interns able to apply for?",
    content:
      "We want you to get hands-on training in the area God is calling you to! We have internships available, in Kids, Students, Young Adults, Production, Worship, Missions, Freedom and Care, Groups, Connections, Communications/Marketing, Films, and Graphic Design.",
  },
  {
    title: "What if I need housing?",
    content:
      "Housing may be available for interns based on individual need and availability.",
  },
  {
    title: "What is the application process?",
    content:
      "Once you have completed the online application, you will then have the following steps: video interview, phone interview with Intern Pastor, zoom interview with ministry leader in your ministry area and an in-person recruit event. ",
  },
  {
    title: "Once I complete an internship, is it possible to do another?",
    content:
      "Absolutely! You are welcome to reapply for internships in the future, including another Summer Internship or a year-long College Internship, as long as you meet the required qualifications.",
  },
  {
    title: "Do I receive paid vacation benefits during my internship?",
    content:
      "No. Each Intern is allowed one week of vacation each semester during their time here with us. This must be approved by your supervisor and the Intern Pastor.",
  },
  {
    title: "Do you provide transportation or travel costs?",
    content:
      "No. You will be responsible for any costs associated with getting here or returning to your current location. You are also responsible for transportation to and from work each day.",
  },
];

const InternshipsFAQs = ({
  faqs = [],
  sectionSubheading,
  sectionTitle,
}: {
  faqs?: { title: string; content: string }[];
  sectionSubheading?: string;
  sectionTitle?: string;
}) => {
  if (faqs.length === 0) return null;

  return (
    <section className="w-full content-padding py-16" id="faq">
      <div className="max-w-[1120px] mx-auto w-full flex flex-col gap-4 md:gap-8 lg:gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          {sectionSubheading && (
            <p className="text-sm font-medium uppercase tracking-[2px] text-ocean text-center">
              {sectionSubheading}
            </p>
          )}
          <h2 className="text-[28px] md:text-[40px] font-bold text-dark-navy text-center">
            {sectionTitle ?? "FAQs"}
          </h2>
        </div>
        <StyledAccordion
          data={faqs}
          itemsStyle="bg-transparent border-b border-[#E0E0E0] rounded-none"
          rootStyle="items-center"
          headerStyle="font-semibold text-[17px] lg:text-lg text-dark-navy"
          contentStyle="text-neutral-default"
        />
      </div>
    </section>
  );
};

export default InternshipsFAQs;
