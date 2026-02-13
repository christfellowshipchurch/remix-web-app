import type { MetaFunction } from "react-router-dom";
import type { LoaderReturnType } from "./loader";
import { loader } from "./loader";
import { createMeta } from "~/lib/meta-utils";
import { generateMetaKeywords } from "~/lib/generate-meta-keywords";

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  if (!data) {
    return createMeta({
      title: "404 – Message Not Found",
      description: "The message you are looking for does not exist.",
    });
  }
  const { message: msg } = data as LoaderReturnType;
  const title = msg?.title ?? "Message";
  const description =
    msg?.summary ?? "Watch this message from Christ Fellowship Church.";
  const categories = [
    ...(msg?.primaryCategories?.map((c: { value: string }) => c.value) ?? []),
    ...(msg?.secondaryCategories?.map((c: { value: string }) => c.value) ?? []),
  ].filter(Boolean);
  const keywords = generateMetaKeywords({
    title: msg?.title,
    categories,
    authorOrSpeaker: msg?.speaker?.fullName,
    seriesTitle: msg?.seriesTitle,
    type: "message",
  });
  return createMeta({
    title,
    description,
    image: msg?.coverImage,
    path: location.pathname,
    keywords,
    author: msg?.speaker?.fullName?.trim() || undefined,
  });
};
