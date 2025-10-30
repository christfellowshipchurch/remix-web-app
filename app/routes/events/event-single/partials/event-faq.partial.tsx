import { StyledAccordion } from "~/components";
import { faqEventData } from "~/lib/faq-data.data";

export const EventSingleFAQ = ({
  title,
  items,
}: {
  title: string;
  items?: { question: string; answer: string }[];
}) => {
  const data = (items ?? []).map((item) => ({
    title: item.question,
    content: item.answer,
  }));
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

      <StyledAccordion
        data={data.length ? data : faqEventData}
        bg="white"
        border="#C6C6C6"
      />

      <div className="flex flex-col gap-1 items-center text-[#717182] font-medium text-center">
        <p>If you have questions, we'd love to help.</p>
        <p>
          Contact us at{" "}
          <a
            className="text-[#4D4D4D] hover:text-ocean cursor-pointer"
            href="mailto:hello@christfellowship.church"
          >
            hello@christfellowship.church
          </a>{" "}
          or call{" "}
          <a
            className="text-[#4D4D4D] hover:text-ocean cursor-pointer"
            href="tel:5617997600"
          >
            (561) 799-7600
          </a>
        </p>
      </div>
    </section>
  );
};
