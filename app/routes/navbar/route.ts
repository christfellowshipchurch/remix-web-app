import type { LoaderFunctionArgs } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import type { FeatureCard } from "~/components/navbar/types";
import { createImageUrlFromGuid } from "~/lib/utils";

const fetchFeatureCards = async () => {
  const navCardDefinedValues: {
    value: string;
    attributeValues: Record<
      string,
      {
        value: string;
        valueFormatted: string;
      }
    >;
  }[] = await fetchRockData({
    endpoint: "DefinedValues",
    queryParams: {
      $filter: "DefinedTypeId eq 580",
      loadAttributes: "simple",
    },
    cache: false,
  });

  return navCardDefinedValues;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const rawFeatureCards = await fetchFeatureCards();

  // Transform the raw data into FeatureCard type
  const mappedFeatureCards: FeatureCard[] = rawFeatureCards.map((card) => {
    const attributes = card.attributeValues;

    // Parse the callToAction which comes in format "title^url"
    const [actionTitle, actionUrl] = (
      attributes.calltoAction?.value || ""
    ).split("^");

    return {
      title: attributes.title?.value || "",
      subtitle: attributes.subtitle?.value || "",
      callToAction: {
        title: actionTitle || "",
        url: actionUrl || "",
      },
      image: createImageUrlFromGuid(attributes.coverImage?.value || ""),
      navMenu: attributes.navMenu?.value || "",
    };
  });

  // Sort cards into their respective menus based on the navMenu attribute
  const ministryCards = mappedFeatureCards.filter(
    (card) => card.navMenu.toLowerCase() === "get involved"
  );
  const mediaCards = mappedFeatureCards.filter(
    (card) => card.navMenu.toLowerCase() === "media"
  );

  return Response.json({
    ministries: {
      featureCards: ministryCards,
    },
    watchReadListen: {
      featureCards: mediaCards,
    },
  });
}

// This is a resource route - no UI needed
export default function NavbarRoute() {
  return null;
}
