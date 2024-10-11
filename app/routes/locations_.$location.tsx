import { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { LocationsHero } from "./locations/partials/locationsSingleHero";
import SetAReminder from "./locations/partials/setAReminder";
import { Testimonials } from "./locations/partials/testimonials";
import {
  faqData,
  testimonialData,
} from "./locations/partials/locationsSingleData";
import { AtThisLocation } from "./locations/partials/atThisLocation.partial";
import StyledAccordion from "~/components/styled-accordion";
import Button from "~/primitives/Button";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");
  //   if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }

  const campusName = params?.location;
  return { campusName };
};

export default function LocationSinglePage() {
  const { campusName } = useLoaderData<typeof loader>();
  console.log(campusName);

  // TODO: Change return based on location (Spanish locations vs English locations)
  return (
    <div className="w-full">
      <LocationsHero name={campusName} />
      <SetAReminder />
      <Testimonials
        testimonies={
          campusName === "cf-everywhere"
            ? testimonialData.cfEverywhere
            : campusName.includes("iglesia")
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      <AtThisLocation name={campusName} />

      {/* FAQ Section */}
      <div className="flex flex-col items-center gap-14 bg-[#F5F5F7] pb-24 pt-14">
        <h2 className=" max-w-[90vw] text-center text-[2rem] font-bold text-secondary">
          Frequently Asked Questions
        </h2>
        {/* TODO: Change from params.title to the name fetched from the query */}
        <StyledAccordion data={faqData(campusName)} bg="white" />
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="text-[26px] font-bold">
            Have additional questions?
          </div>
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
    </div>
  );
}
