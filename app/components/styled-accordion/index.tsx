import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import "./accordion.css";
import HTMLRenderer from "~/primitives/html-renderer";

type AccordionDataType = {
  bg?: string;
  data: {
    title: string;
    content: string;
  }[];
};

const StyledAccordion = ({ data, bg }: AccordionDataType) => {
  return (
    <Accordion.Root
      className="AccordionRoot flex w-full max-w-screen-md flex-col items-center gap-4 "
      type="multiple"
    >
      {data?.map((item, index) => {
        return (
          <Accordion.Item
            key={index}
            style={{ backgroundColor: bg ? bg : `#E7F9FE` }}
            className={`AccordionItem w-[90vw] rounded-lg px-6 sm:w-[560px] lg:w-[768px]`}
            value={`item-${index + 1}`}
          >
            <Accordion.Header className="AccordionHeader flex py-5 text-lg font-bold">
              <Accordion.Trigger className="AccordionTrigger inline-flex w-full text-start items-center justify-between">
                {item?.title}
                <ChevronDownIcon className="AccordionChevron" aria-hidden />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="AccordionContent pb-6">
              <div className="AccordionContentText">
                <HTMLRenderer html={item?.content} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};

export default StyledAccordion;
