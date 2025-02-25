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
    id: string;
    firstName: string;
    lastName: string;
    photo: {
      uri: string;
    };
  }>;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const title = params.path as string;

  if (!title) {
    throw new Error("Group not found");
  }

  const appId = process.env.ALGOLIA_APP_ID;
  const searchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

  if (!appId || !searchApiKey) {
    throw new AuthenticationError("Algolia credentials not found");
  }

  return {
    ALGOLIA_APP_ID: appId,
    ALGOLIA_SEARCH_API_KEY: searchApiKey,
    groupName: decodeURIComponent(title),
  };
}
