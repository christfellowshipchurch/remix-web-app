import { LoaderFunctionArgs } from "react-router-dom";
import { AuthenticationError } from "~/lib/.server/error-types";
import { algoliasearch } from "algoliasearch";
import { escapeAlgoliaFilterString } from "~/components/finders/finder-algolia.utils";
import { GroupType, GROUPS_ALGOLIA_INDEX_NAME } from "../group-finder/types";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupGUID: string;
  group: GroupType | null;
};

async function fetchGroupWithFilter(
  filters: string,
  appId: string,
  apiKey: string,
): Promise<GroupType | null> {
  try {
    const searchClient = algoliasearch(appId, apiKey);

    const response = await searchClient.searchForHits<Record<string, unknown>>([
      {
        indexName: GROUPS_ALGOLIA_INDEX_NAME,
        params: {
          filters,
          hitsPerPage: 1,
        },
      },
    ]);

    const hit = response.results[0]?.hits?.[0];
    if (!hit) {
      return null;
    }

    return hit as unknown as GroupType;
  } catch (error) {
    console.error("Failed to fetch group from Algolia:", error);
    return null;
  }
}

// TOOD: Replace ObjectID with groupGUID later once in Algolia
async function fetchGroupByPathSegment(
  segment: string,
  appId: string,
  apiKey: string,
): Promise<GroupType | null> {
  const escaped = escapeAlgoliaFilterString(segment);
  const byGuid = await fetchGroupWithFilter(
    `objectID:"${escaped}"`,
    appId,
    apiKey,
  );
  if (byGuid) {
    return byGuid;
  }
  /** Legacy URLs used Algolia `objectID` in the path. */
  return fetchGroupWithFilter(`objectID:"${escaped}"`, appId, apiKey);
}

export async function loader({ params }: LoaderFunctionArgs) {
  const groupGUID = params.path || "";

  if (!groupGUID) {
    throw new Error("Group not found");
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  const group = await fetchGroupByPathSegment(groupGUID, appId, searchApiKey);

  return Response.json({
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupGUID,
    group,
  });
}
