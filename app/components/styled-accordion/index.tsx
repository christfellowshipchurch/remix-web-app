import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import HTMLRenderer from "~/primitives/html-renderer";

type AccordionDataType = {
  bg?: string;
  center?: boolean;
  border?: string;
  data: {
    title: string;
    content: string;
  }[];
};

const StyledAccordion = ({ data, bg, border, center }: AccordionDataType) => {
  return (
    <Accordion.Root
      className="AccordionRoot flex w-full max-w-screen-md flex-col gap-4"
      type="multiple"
      style={{ alignItems: `${center ? "center" : "flex-start"}` }}
    >
      {data?.map((item, index) => {
        return (
          <Accordion.Item
            key={index}
            style={{
              backgroundColor: bg ? bg : `#E7F9FE`,
              border: `${border ? `1px solid ${border}` : ""}`,
            }}
            className={`AccordionItem w-[90vw] rounded-lg px-6 md:w-[560px] lg:w-[768px]`}
            value={`item-${index + 1}`}
          >
            <Accordion.Header className="AccordionHeader flex py-5 text-lg font-bold">
              <Accordion.Trigger className="AccordionTrigger inline-flex w-full items-center justify-between text-start group">
                {item?.title}
                <ChevronDownIcon
                  className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
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
