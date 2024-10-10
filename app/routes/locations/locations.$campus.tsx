// import { LoaderFunctionArgs } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import invariant from "tiny-invariant";

// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   invariant(params.campus, "No Campus");

//   console.log({ params });
//   const campus = params?.campus;
//   return { campus };
// };

// const Campus = () => {
//   const { campus } = useLoaderData<typeof loader>();

//   return (
//     <div>
//       <div>{campus}</div>
//     </div>
//   );
// };

// export default Campus;

import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.campus, "No Campus");
  //   if (!contact) {
  //     throw new Response("Not Found", { status: 404 });
  //   }

  const campus = params?.campus;
  return { campus };
};

import Button from "~/primitives/Button";
import { faqData, testimonialData } from "./partials/locationsSingleData";
import SetAReminder from "./partials/setAReminder";
import { Testimonials } from "./partials/testimonials";
import StyledAccordion from "~/components/styled-accordion";
import { AtThisLocation } from "./partials/atThisLocation.partial";
import { LocationsHero } from "./partials/locationsSingleHero";

export default async function LocationSinglePage({
  params,
}: {
  params: { location: string };
}) {
  // const { data } = await query({
  //   query: GET_CAMPUS_BY_URL,
  //   variables: { url: params?.location },
  //   fetchPolicy: "network-only",
  // })

  // TODO: Change return based on location (Spanish locations vs English locations)
  return (
    <div className="w-full">
      <LocationsHero name={params?.location} />
      <SetAReminder />
      <Testimonials
        testimonies={
          params?.location === "cf-everywhere"
            ? testimonialData.cfEverywhere
            : params?.location.includes("iglesia")
            ? testimonialData.españolCampuses
            : testimonialData.default
        }
      />
      <AtThisLocation name={params?.location} />

      {/* FAQ Section */}
      <div className="flex flex-col items-center gap-14 bg-[#F5F5F7] pb-24 pt-14">
        <h2 className=" max-w-[90vw] text-center text-[2rem] font-bold text-secondary">
          Frequently Asked Questions
        </h2>
        {/* TODO: Change from params.title to the name fetched from the query */}
        <StyledAccordion data={faqData(params?.location)} bg="white" />
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
