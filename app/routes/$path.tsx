import { useLoaderData } from "react-router";
import { PageBuilderLoader } from "./page-builder/types";
import { DynamicHero } from "~/components";

// Page Builder Route
export { loader } from "./page-builder/loader";

export default function PageBuilderRoute() {
  const { title, heroImage, callsToAction, content } =
    useLoaderData<PageBuilderLoader>();

  return (
    <div>
      <DynamicHero
        customTitle={title}
        imagePath={heroImage}
        ctas={callsToAction.map((cta) => ({
          href: cta.url,
          title: cta.title,
        }))}
      />
      {/* Insert Page Builder Content Here */}
    </div>
  );
}
