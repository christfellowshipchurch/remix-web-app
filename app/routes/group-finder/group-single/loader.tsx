import { LoaderFunctionArgs } from "react-router-dom";
import { AuthenticationError } from "~/lib/.server/error-types";

export type LoaderReturnType = {
  ALGOLIA_APP_ID: string;
  ALGOLIA_SEARCH_API_KEY: string;
  groupName: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const title = params.path || "";

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
