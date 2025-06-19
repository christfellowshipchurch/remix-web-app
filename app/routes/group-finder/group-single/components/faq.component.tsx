import { useState } from "react";
import Icon from "~/primitives/icon";

const faqData = [
  {
    question: "What is this group about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
  },
  {
    question: "What is this group about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
  },
  {
    question: "What is this group about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
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
    <div className="text-left flex flex-col p-6 border border-[#C6C6C6] rounded-lg max-w-[768px]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between gap-2 w-full"
      >
        <h3 className="md:text-xl lg:text-2xl font-semibold text-left">
          {question}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <Icon name="chevronDown" />
          </div>
        </div>
      </button>
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
    <div className="flex flex-col gap-6 md:gap-12">
      <h2 className="text-lg md:text-[28px] lg:text-[32px] font-extrabold">
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
