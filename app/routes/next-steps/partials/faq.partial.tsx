import { StyledAccordion } from "~/components";
import { Button } from "~/primitives/button/button.primitive";

const faqs = [
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

export function FAQSection() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Your questions, answered!
        </h2>
        <div className="max-w-3xl mx-auto">
          <StyledAccordion data={faqs} bg="white" center border="#E5E7EB" />
        </div>
        <div className="flex flex-col items-center gap-6 mt-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900">
            Still have questions?
          </h2>
          <p className="text-center">
            Reach out to someone on our team for more information.
          </p>
          <Button
            href="https://rock.gocf.org/contactus"
            target="_blank"
            intent="secondary"
          >
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}
