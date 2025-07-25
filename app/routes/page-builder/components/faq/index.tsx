import { useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { PageBuilderSection } from "../../types";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";

export const FAQsComponent = ({ data }: { data: PageBuilderSection }) => {
  return (
    <div className="w-full content-padding py-12 md:py-28 bg-white">
      <div className="max-w-[768px] mx-auto flex flex-col items-center gap-12 lg:gap-20">
        <div className="flex flex-col gap-6 text-center">
          <h2 className="text-[48px] md:text-[52px] font-extrabold text-text-primary">
            {data.name}
          </h2>
          {data?.content?.length > 0 && (
            <HTMLRenderer className="md:text-lg" html={data.content} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          {data.faqs?.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="w-full flex flex-col items-center text-center gap-6 md:-mt-8">
          <h2 className="text-2xl md:text-[28px] font-extrabold">
            Still have questions?
          </h2>

          <Button href="/contact" intent="secondary" className="font-normal">
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="rounded-[1rem] text-left flex flex-col py-4 px-5 md:py-5 md:px-6 border border-[#666666] max-w-[768px] lg:max-w-none hover:bg-gray-50 transition-all duration-200 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between gap-2 w-full cursor-pointer">
        <h3 className="md:text-lg font-bold text-left">{question}</h3>
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
          <HTMLRenderer html={answer} />
        </div>
      </div>
    </div>
  );
}
