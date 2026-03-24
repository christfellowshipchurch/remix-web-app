import type { LoaderFunctionArgs } from "react-router-dom";
import {
  buildLeadersWithArticles,
  leadersWithEmptyArticles,
} from "~/lib/.server/build-leaders-with-articles";

export async function loader(_args: LoaderFunctionArgs) {
  try {
    const leadersWithArticles = await buildLeadersWithArticles();
    return Response.json({ leadersWithArticles });
  } catch (error) {
    console.error("Error in home-leaders-articles loader:", error);
    return Response.json({ leadersWithArticles: leadersWithEmptyArticles() });
  }
}
