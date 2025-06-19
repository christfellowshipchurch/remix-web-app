import { Button } from "~/primitives/button/button.primitive";
import { FinderSingleFAQ } from "~/routes/group-finder/group-single/components/faq.component";

const faqData = [
  {
    question: "What is this class about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
  },
  {
    question: "What is this class about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
  },
  {
    question: "What is this class about?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
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
