import { useLoaderData } from "react-router";
import { PageBuilderLoader } from "./page-builder/types";
import { DynamicHero } from "~/components";

// Page Builder Route
export { loader } from "./page-builder/loader";

function PageBuilderRoute() {
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
      {sections.map((section) => (
        <div key={section.id}>
          <h2>{section.name}</h2>
          <p>{section.type}</p>
        </div>
      ))}
    </div>
  );
}

export default PageBuilderRoute;
