import { Leader, leaders } from "./components/leaders-data";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { Author, getAuthorDetails } from "../author/loader";

const getAuthorIdsByPathname = async (person: Leader): Promise<string> => {
  try {
    const authorData = await fetchRockData({
      endpoint: "People/GetByAttributeValue",
      queryParams: {
        attributeKey: "Pathname",
        value: person.pathname,
        $select: "Id",
      },
    });

    return authorData.id;
  } catch (error) {
    console.error("Error fetching author:", error);
    throw new Error(`Failed to fetch author ID for ${person.pathname}`);
  }
};

// Grabs author data for the LeadersGrid and LeaderScroll components
export const loader = async (): Promise<{ authors: Author[] }> => {
  const authorIds = await Promise.all(leaders.map(getAuthorIdsByPathname));
  const authorDetails = await Promise.all(authorIds.map(getAuthorDetails));

  const authors: Author[] = authorDetails.map((data) => ({
    hostUrl: process.env.HOST_URL || "host-url-not-found",
    fullName: data.fullName,
    profilePhoto: data.photo.uri ?? "",
    authorAttributes: data.authorAttributes,
  }));

  return { authors };
};
