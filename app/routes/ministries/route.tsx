import { DynamicHero } from "~/components";
import { AllMinistriesPartial } from "./all-ministries/partials/all-ministries.partial";
import { ministries } from "./all-ministries/ministries.data";

export default function AllMinistriesPage() {
  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/ministries-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Volunteer" }]}
      />
      <AllMinistriesPartial ministries={ministries} />
    </div>
  );
}
