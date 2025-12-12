import { useLoaderData } from "react-router-dom";
import { DynamicHero } from "~/components";
import { PageBuilderLoader } from "../page-builder/types";
import { renderSection } from "../page-builder/page-builder-page";
import { MinistryServiceTimes } from "./components/ministry-service-times.component";

export function MinistryBuilderRoute() {
  const { title, heroImage, callsToAction, sections, services } =
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
      <MinistryServiceTimes services={services} />
    </div>
  );
}

export default MinistryBuilderRoute;
