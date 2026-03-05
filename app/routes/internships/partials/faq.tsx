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
      "Absolutely! You are able to reapply for any internship in the future. This includes another Summer Internship or a year long College Internship if you have completed the necessary requirements.",
  },
  {
    title: "What if I need housing?",
    content: "We will provide housing on a needs basis only.",
  },
  {
    title: "Do you provide transportation or travel costs?",
    content:
      "No. You will be responsible for any costs associated with getting here or returning to your current location. You are also responsible for transportation to and from work each day.",
  },
];

export const yearLongFaqs = [
  {
    title: "What does Christ Fellowship believe as a church?",
    content:
      "At Christ Fellowship, our goal and our vision is that, together, we would lead a radical transformation for Jesus Christ in this region and beyond—everyone, everyday, everywhere. To do this, we rally around this shared vision and some shared biblically-based beliefs and values. Learn more about <a className='underline text-ocean' href='/about#beliefs'>what we believe</a> and our core values of what we do as a church.",
  },
  {
    title: "What does Christ Fellowship have for families?",
    content:
      "No matter what age or stage of life, there's something here for the whole family! We have environments designed specifically for your <a className='underline text-ocean' href='/ministries/kids'>kids</a>, <a className='underline text-ocean' href='/ministries/students'>students</a>, and <a className='underline text-ocean' href='/ministries/young-adults'>young adults</a>—and in fact, we're doing more for the next generation than ever before. Learn more about our Get There First initiative and how your family can be a part of it.",
  },
  {
    title: "What events does Christ Fellowship have coming up?",
    content:
      "We have ministries for everyone throughout the week and can't-miss special events you'll want on your calendar! See what's <a className='underline text-ocean' href='/events'>coming up at Christ Fellowship</a>.",
  },
  {
    title: "What resources does Christ Fellowship offer?",
    content:
      "Every week, we create a collection of personalized resources including encouraging messages and practical articles, devotionals, and podcasts. We also offer <a className='underline text-ocean' href='/ministries/care'>care ministries</a> throughout the week for every hurt, habit, or hangup. Have something we can be praying with you for? <a className='underline text-ocean' target='_blank' href='https://rock.gocf.org/RequestPrayer'>Share your prayer request!</a>",
  },
  {
    title: "Where is Christ Fellowship located?",
    content:
      "Christ Fellowship is one church with many <a className='underline text-ocean' href='/locations'>locations across South Florida</a>, and <a className='underline text-ocean' href='/locations/cf-everywhere'>online</a>—wherever you are!",
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
      <div className="max-w-screen-content mx-auto w-full flex flex-col gap-4 md:gap-8 lg:gap-12">
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
