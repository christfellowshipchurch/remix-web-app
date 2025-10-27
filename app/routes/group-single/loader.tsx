import { LoaderFunctionArgs } from "react-router-dom";
import { AuthenticationError } from "~/lib/.server/error-types";
import { algoliasearch } from "algoliasearch";
import { GroupType } from "../group-finder/types";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupId: string;
  group: GroupType | null;
};

async function fetchGroupById(
  groupId: string,
  appId: string,
  apiKey: string
): Promise<GroupType | null> {
  try {
    const searchClient = algoliasearch(appId, apiKey);

    // Search for the specific group by objectID
    const response = await searchClient.searchForHits<GroupType>([
      {
        indexName: "dev_daniel_Groups",
        params: {
          filters: `objectID:"${groupId}"`,
          hitsPerPage: 1,
        },
      },
    ]);

    if (response.results[0]?.hits && response.results[0]?.hits.length > 0) {
      return response.results[0].hits[0] as GroupType;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch group from Algolia:", error);
    return null;
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const groupId = params.path || "";

  if (!groupId) {
    throw new Error("Group not found");
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  // Fetch the group data from Algolia
  const group = await fetchGroupById(groupId, appId, searchApiKey);

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupId,
    group,
  });
}
