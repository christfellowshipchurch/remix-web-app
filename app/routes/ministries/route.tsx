import { DynamicHero } from "~/components";
import { AllMinistriesPartial } from "./all-ministries/partials/all-ministries.partial";
import { useLoaderData } from "react-router-dom";
import type { Ministry } from "./loader";

export { loader } from "./loader";
export { meta } from "./meta";

export default function AllMinistriesPage() {
  const { ministries } = useLoaderData<{ ministries: Ministry[] }>();

  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/ministries-hero.webp"
        ctas={[{ href: "/volunteer", title: "Volunteer" }]}
      />
      <AllMinistriesPartial ministries={ministries} />
    </div>
  );
}
