import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import HTMLRenderer from "~/primitives/html-renderer";
import { cn } from "~/lib/utils";

type AccordionDataType = {
  bg?: string;
  center?: boolean;
  border?: string;
  headerStyle?: string;
  triggerStyle?: string;
  contentStyle?: string;
  data: {
    title: string;
    content: string;
  }[];
};

export const StyledAccordion = ({
  data,
  bg,
  border,
  center,
  headerStyle,
  triggerStyle,
  contentStyle,
}: AccordionDataType) => {
  return (
    <Accordion.Root
      className="AccordionRoot flex w-full flex-col gap-4"
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
            className={`AccordionItem w-full rounded-lg px-6 md:max-w-none cursor-pointer`}
            value={`item-${index + 1}`}
          >
            <Accordion.Header
              className={cn(
                "AccordionHeader flex py-5 text-lg font-bold cursor-pointer",
                headerStyle,
              )}
            >
              <Accordion.Trigger
                className={cn(
                  "AccordionTrigger inline-flex w-full items-center justify-between text-start group cursor-pointer",
                  triggerStyle,
                )}
              >
                {item?.title}
                <ChevronDownIcon
                  className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className={cn(
                "AccordionContent pb-6 overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                contentStyle,
              )}
            >
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
