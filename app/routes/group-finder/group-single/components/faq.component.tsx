import { useState } from "react";
import Icon from "~/primitives/icon";

const faqData = [
  {
    question: "What Are Small Groups?",
    answer:
      "Small groups are gatherings of three or more people who meet regularly to talk about life, reflect on the weekend message, and grow in faith together. There’s no set formula—just a circle of friends committed to walking through life’s ups and downs. We believe God designed us to find freedom and healing through relationships, and small groups are one of the best ways to experience that.",
  },
  {
    question: "Where Do Small Groups Meet?",
    answer:
      "Most groups meet in homes, parks, or restaurants—usually based on the leader’s location and often near a church campus.",
  },
  {
    question: "What Types of Small Groups Are Available?",
    answer:
      "We offer Bible study, activity, and Freedom groups for men, women, and married couples. Groups are available for all life stages, with both morning and evening options",
  },
  {
    question: "Is Childcare Provided During Group Meetings?",
    answer:
      "Childcare is not provided, so group members will need to make their own arrangements.",
  },
];

export function FinderSingleFAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="text-left flex flex-col py-2 px-4 md:py-6 md:px-8 border border-[#C6C6C6] rounded-lg max-w-[768px] lg:max-w-none hover:bg-gray-50 transition-all duration-200 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between gap-2 w-full cursor-pointer">
        <h3 className="md:text-lg font-semibold text-left">{question}</h3>
        <div className="flex items-center gap-2">
          <div
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <Icon name="chevronDown" />
          </div>
        </div>
      </div>
      <div
        className={`grid transition-all duration-200 ${
          isExpanded ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-gray-600 text-sm md:text-base">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export const GroupFAQ = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <h2 className="text-lg md:text-2xl font-extrabold">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-4">
        {faqData.map((faq, index) => (
          <FinderSingleFAQ
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
};
