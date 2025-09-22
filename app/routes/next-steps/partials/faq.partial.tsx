import { StyledAccordion } from "~/components";

const faqs = [
  {
    title: "What does Christ Fellowship believe as a church?",
    content:
      "At Christ Fellowship, our goal and our vision is that, together, we would lead a radical transformation for Jesus Christ in this region and beyond—everyone, everyday, everywhere. To do this, we rally around this shared vision and some shared biblically-based beliefs and values. Learn more about what we believe and our core values of what we do as a church.",
  },
  {
    title: "What does Christ Fellowship have for families?",
    content:
      "No matter what age or stage of life, there's something here for the whole family! We have environments designed specifically for your kids, students, and young adults—and in fact, we're doing more for the next generation than ever before. Learn more about our Get There First initiative and how your family can be a part of it.",
  },
  {
    title: "What events does Christ Fellowship have coming up?",
    content:
      "We have ministries for everyone throughout the week and can't-miss special events you'll want on your calendar! See what's coming up at Christ Fellowship.",
  },
  {
    title: "What resources does Christ Fellowship offer?",
    content:
      "Every week, we create a collection of personalized resources including encouraging messages and practical articles, devotionals, and podcasts. We also offer care ministries throughout the week for every hurt, habit, or hangup. Have something we can be praying with you for? Share your prayer request!",
  },
  {
    title: "Where is Christ Fellowship located?",
    content:
      "Christ Fellowship is one church with many locations across South Florida, and online—wherever you are!",
  },
];

export function FAQSection() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
          Your questions, answered!
        </h2>
        <div className="max-w-3xl mx-auto">
          <StyledAccordion data={faqs} bg="white" center border="#E5E7EB" />
        </div>
      </div>
    </section>
  );
}
