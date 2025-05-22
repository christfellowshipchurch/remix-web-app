import { ActionFunction } from "react-router";
import { Author, getAuthorDetails } from "../author/loader";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const authorId = formData.id as string;

  const data = await getAuthorDetails(authorId);

  if (!data) {
    // This should stop execution and propagate the error to Remix's error boundary
    throw new Response("Author not found at: /author/" + authorId, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const authorData: Author = {
    hostUrl:
      `${process.env.HOST_URL}/author/${authorId}` || "host-url-not-found",
    fullName: data.fullName,
    profilePhoto: data.photo.uri ?? "",
    authorAttributes: data.authorAttributes,
  };

  return authorData;
};
