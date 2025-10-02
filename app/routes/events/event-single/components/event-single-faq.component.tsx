import { StyledAccordion } from "~/components";
import { faqEventData } from "~/lib/faq-data.data";

export const EventSingleFAQ = ({ title }: { title: string }) => {
  return (
    <section
      className="flex flex-col gap-12 py-12 md:py-24 content-padding"
      id="faq"
    >
      <h2 className="font-extrabold text-center text-[32px]">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-lg font-medium md:mx-4">
        Questions about {title}, we've got answers. Here are some of the most
        common questions we receive.
      </p>
      <StyledAccordion data={faqEventData} bg="white" border="#C6C6C6" />
    </section>
  );
};
