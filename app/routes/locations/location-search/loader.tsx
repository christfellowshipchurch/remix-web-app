import { LoaderFunctionArgs } from "react-router-dom";
import { fetchWistiaData } from "~/lib/.server/fetch-wistia-data";

export async function loader({ params }: LoaderFunctionArgs) {
  const bgVideo = await fetchWistiaData({ id: "padj4c4xoh", size: 960 });

  return { bgVideo };
}
