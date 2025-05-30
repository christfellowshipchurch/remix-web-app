// This loader is used to fetch the feature cards for the navbar and is stored in the root loader to be used across the app

import type { LoaderFunctionArgs } from "react-router";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import type { FeatureCard } from "~/components/navbar/types";
import { createImageUrlFromGuid } from "~/lib/utils";
import { getUserFromRequest } from "~/lib/.server/authentication/get-user-from-request";
import type { User } from "~/providers/auth-provider";

// Define the return type for the loader
interface NavbarLoaderData {
  userData: User | null;
  ministries: {
    featureCards: FeatureCard[];
  };
  watchReadListen: {
    featureCards: FeatureCard[];
  };
  algolia: {
    ALGOLIA_APP_ID: string | undefined;
    ALGOLIA_SEARCH_API_KEY: string | undefined;
  };
}

const fetchFeatureCards = async () => {
  try {
    const navCardDefinedValues = await fetchRockData({
      endpoint: "DefinedValues",
      queryParams: {
        $filter: "DefinedTypeId eq 580",
        loadAttributes: "simple",
      },
    });

    return navCardDefinedValues;
  } catch (error) {
    console.error("Error fetching feature cards:", error);
    return [];
  }
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<NavbarLoaderData> {
  try {
    // Todo: fix user data for mobile/desktop nav menus. right now it's not returning the full user object, but is at least notifying is user is logged in or not. We will wait until the UI for the logged in experience is complete to fix this.
    const userData = await getUserFromRequest(request);

    // Handle the Response object
    let parsedUserData: User | null = null;
    if (userData instanceof Response) {
      const data = await userData.json();
      if (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        "fullName" in data &&
        "email" in data &&
        "phoneNumber" in data &&
        "guid" in data &&
        "gender" in data &&
        "birthDate" in data &&
        "photo" in data
      ) {
        parsedUserData = data as User;
      }
    } else if (
      userData &&
      typeof userData === "object" &&
      "id" in userData &&
      "fullName" in userData &&
      "email" in userData &&
      "phoneNumber" in userData &&
      "guid" in userData &&
      "gender" in userData &&
      "birthDate" in userData &&
      "photo" in userData
    ) {
      parsedUserData = userData as User;
    }

    const rawFeatureCards = await fetchFeatureCards();

    // If the API call failed, return empty arrays
    if (!rawFeatureCards || !Array.isArray(rawFeatureCards)) {
      return {
        userData: null,
        ministries: { featureCards: [] },
        watchReadListen: { featureCards: [] },
        algolia: {
          ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
          ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
        },
      };
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

    return {
      userData: parsedUserData,
      ministries: {
        featureCards: ministryCards,
      },
      watchReadListen: {
        featureCards: mediaCards,
      },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
      },
    };
  } catch (error) {
    console.error("Error in navbar loader:", error);
    // Return empty arrays instead of throwing to prevent UI from breaking
    return {
      userData: null,
      ministries: { featureCards: [] },
      watchReadListen: { featureCards: [] },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
      },
    };
  }
}
