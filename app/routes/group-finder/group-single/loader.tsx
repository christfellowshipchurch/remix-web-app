import { LoaderFunctionArgs } from "react-router";
import { AuthenticationError } from "~/lib/.server/error-types";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupName: string;
  coverImage: string;
  tags: string[];
  leaders: Array<{
    name: string;
    photo: string;
  }>;
};

const fetchGroupData = async (title: string) => {
  // Decode the URL-encoded title
  const groupName = decodeURIComponent(title);

  const groupData = await fetchRockData({
    endpoint: "Groups",
    queryParams: {
      $filter: `Name eq '${groupName}'`,
      loadAttributes: "simple",
    },
  });

  return groupData;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const title = params.path as string;

  //   if (!title) {
  //     throw new Error("Group not found");
  //   }

  //   const groupData = await fetchGroupData(title);

  //   if (!groupData?.length) {
  //     throw new Error("Group not found");
  //   }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  return {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupName: decodeURIComponent(title),
    coverImage: "/assets/images/groups-hero-bg.webp",
    tags: ["Everyone", "Tag 2", "Tag 3"],
    leaders: [
      {
        name: "John Doe",
        photo: "/assets/images/groups-hero-bg.webp",
      },
    ],
    // groupName: groupData[0].name,
    // coverImage: groupData[0].coverImage,
  };
}
