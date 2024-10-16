import StyledAccordion from "~/components/styled-accordion";
import Button from "~/primitives/button";
import { CampusInfoTypes } from "../location-single.types";
import { faqData } from "~/lib/faqData";

export const LocationFAQ = ({ name }: CampusInfoTypes) => {
  return (
    <div className="flex flex-col items-center gap-14 bg-[#F5F5F7] pb-24 pt-14">
      <h2 className=" max-w-[90vw] text-center text-[2rem] font-bold text-secondary">
        Frequently Asked Questions
      </h2>
      {/* TODO: Change from params.title to the name fetched from the query */}
      <StyledAccordion data={faqData(name)} bg="white" />
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="text-[26px] font-bold">Have additional questions?</div>
        <p className="text-[15px]">
          Someone from our team is happy to answer any of your questions!
        </p>
        <Button
          href=""
          className="w-32 rounded-[6px] lg:w-44"
          size="md"
          intent="secondary"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};
