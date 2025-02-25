import type { LoaderFunctionArgs } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import type { FeatureCard } from "~/components/navbar/types";
import { createImageUrlFromGuid } from "~/lib/utils";

const fetchFeatureCards = async () => {
  try {
    const navCardDefinedValues = await fetchRockData({
      endpoint: "DefinedValues",
      queryParams: {
        $filter: "DefinedTypeId eq 580",
        loadAttributes: "simple",
      },
      cache: false,
    });

    return navCardDefinedValues;
  } catch (error) {
    console.error("Error fetching feature cards:", error);
    return [];
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const rawFeatureCards = await fetchFeatureCards();

    // If the API call failed, return empty arrays
    if (!rawFeatureCards || !Array.isArray(rawFeatureCards)) {
      return Response.json({
        ministries: { featureCards: [] },
        watchReadListen: { featureCards: [] },
      });
    }

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
  } catch (error) {
    console.error("Error in navbar loader:", error);
    // Return empty arrays instead of throwing to prevent UI from breaking
    return Response.json({
      ministries: { featureCards: [] },
      watchReadListen: { featureCards: [] },
    });
  }
}

// This is a resource route - no UI needed
export default function NavbarRoute() {
  return null;
}
