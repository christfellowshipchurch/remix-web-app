import { Button } from "~/primitives/button/button.primitive";
import { FinderSingleFAQ } from "~/routes/group-finder/group-single/components/faq.component";

const faqData = [
  {
    question: "What Are Classes?",
    answer:
      "Classes at Christ Fellowship are gatherings designed to help you grow in your faith, build community, and take next steps in your spiritual journey. Whether you're diving into Scripture, exploring felt need life topics, or walking through the Freedom experience, these classes offer a consistent place to connect and grow alongside others.",
  },
  {
    question: "Where Do Classes Meet?",
    answer:
      "Classes typically meet onsite or online at Christ Fellowship campuses in small group tables that foster learning, discussion, and connection.",
  },
  {
    question: "What Types of Classes Are Available?",
    answer:
      "We offer Bible study classes, topical felt needs studies, and Freedom classes for men, women, and married couples. Classes are designed for various life stages.",
  },
  {
    question: "Is Childcare Provided?",
    answer:
      "During Sunday services, kids experience engaging worship, small groups led by caring leaders, and Bible-based teaching designed to help them love Jesus, love others, and love life. In addition, we offer midweek discipleship programming created with your child in mind. While not all classes include childcare, some may align with these midweek programs. Please check your specific class details for childcare availability.",
  },
];

export const ClassFAQ = () => {
  return (
    <div className="flex flex-col gap-20 pt-16 pb-28 text-center w-full max-w-[768px]">
      {/* Title */}
      <div className="flex flex-col gap-6 items-center">
        <h2 className="text-[52px] font-extrabold leading-tight">Class FAQs</h2>
        <p className="text-lg">
          Find answers to common questions about this class.
        </p>
      </div>

      {/* FAQs */}
      <div className="flex flex-col gap-4">
        {faqData.map((faq, index) => (
          <FinderSingleFAQ
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {/* Contact */}
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h3 className="text-[28px] font-extrabold">Still have a question?</h3>
          <p className="text-lg">
            Reach out to the class leader for more information.
          </p>
        </div>

        <Button intent="secondary">Contact</Button>
      </div>
    </div>
  );
};
