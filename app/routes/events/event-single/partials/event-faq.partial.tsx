import { StyledAccordion } from "~/components";

export const EventSingleFAQ = ({
  title,
  items,
}: {
  title: string;
  items?: { question: string; answer: string }[];
}) => {
  return (
    <section
      className="flex flex-col gap-12 py-12 md:py-24 content-padding"
      id="faq"
    >
      <div className="max-w-screen-content mx-auto">
        <div className="w-full md:w-[670px] mx-auto">
          <h2 className="font-extrabold text-center text-[32px] mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-center mb-6 text-lg font-medium text-gray-600 max-w-xl mx-auto">
            Questions about {title}, we've got answers. Here are some of the
            most common questions we receive.
          </p>

          <StyledAccordion
            data={
              items?.map((item) => ({
                title: item.question,
                content: item.answer,
              })) ?? []
            }
            rootStyle="items-center"
            itemsStyle="bg-white border border-[#C6C6C6"
          />

          <div className="flex flex-col gap-1 items-center text-[#717182] font-medium text-center mt-10">
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
        </div>
      </div>
    </section>
  );
};
