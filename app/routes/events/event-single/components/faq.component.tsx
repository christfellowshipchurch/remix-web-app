import StyledAccordion from "~/components/styled-accordion";
import { faqEventData } from "~/lib/faq-data.data";

export const EventSingleFAQ = () => {
  return (
    <div className="flex flex-col gap-12">
      <h2 className="font-extrabold text-[32px]">Frequently Asked Questions</h2>
      <StyledAccordion data={faqEventData} bg="white" border="#C6C6C6" />
    </div>
  );
};
