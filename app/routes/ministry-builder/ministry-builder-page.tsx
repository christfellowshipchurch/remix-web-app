import { useLoaderData } from "react-router-dom";
import { DynamicHero } from "~/components";
import { PageBuilderLoader } from "../page-builder/types";
import { renderSection } from "../page-builder/ministry-builder-page";

export function MinistryBuilderRoute() {
  const { title, heroImage, callsToAction, sections } =
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

      {sections.map(renderSection)}
    </div>
  );
}

export default MinistryBuilderRoute;
