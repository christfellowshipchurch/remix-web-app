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
import { mapKeys, mapValues, camelCase } from "lodash";
import { CampusData } from "~/libs/rockTypes";

const baseUrl = process.env.ROCK_API;
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization-Token": `${process.env.ROCK_TOKEN}`,
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.location, "No Campus");
  function normalize(data: object): object {
    if (Array.isArray(data)) return data.map((n) => normalize(n));
    if (typeof data !== "object" || data === null) return data;
    const normalizedValues = mapValues(data, (n) => normalize(n));
    return mapKeys(normalizedValues, (value, key: string) => camelCase(key));
  }

  // Fetch Campus Data
  const res = await fetch(
    `${baseUrl}Campuses?$filter=Url eq '${params?.location}'&loadAttributes=simple`,
    {
      headers: {
        ...defaultHeaders,
      },
    }
  );
  const data = await res.json();
  return { data: normalize(data) as CampusData[] };
};

export default function LocationSinglePage() {
  const { data } = useLoaderData<typeof loader>();
  const { name, phoneNumber, serviceTimes, attributeValues } = data[0];

  // TODO: Change return based on location (Spanish locations vs English locations)
  return (
    <div className="w-full">
      <LocationsHero name={name} />
      <SetAReminder />
      <Testimonials
        testimonies={
          name === "cf-everywhere"
            ? testimonialData.cfEverywhere
            : name.includes("iglesia")
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      <AtThisLocation name={name} />

      {/* FAQ Section */}
      <div className="flex flex-col items-center gap-14 bg-[#F5F5F7] pb-24 pt-14">
        <h2 className=" max-w-[90vw] text-center text-[2rem] font-bold text-secondary">
          Frequently Asked Questions
        </h2>
        {/* TODO: Change from params.title to the name fetched from the query */}
        <StyledAccordion data={faqData(name)} bg="white" />
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
