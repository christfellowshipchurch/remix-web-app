import type { MetaFunction } from "react-router-dom";
import { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return createMeta({
      title: "404 – Message Not Found",
      description: "The message you are looking for does not exist.",
    });
  }
  const msg = data.message;
  const title = msg?.title ?? "Message";
  const description =
    msg?.summary ?? "Watch this message from Christ Fellowship Church.";
  return createMeta({
    title,
    description,
    image: msg?.coverImage,
  });
};
