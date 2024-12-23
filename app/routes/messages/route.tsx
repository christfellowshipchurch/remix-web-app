import AllMessages from "./partials/all-messages.partial";
import CurrentSeries from "./partials/current-messages.partial";
import { DynamicHero } from "~/components/dynamic-hero";

export default function Messages() {
  return (
    <div>
      <DynamicHero
        imagePath="../app/assets/images/messages-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Live Broadcast" }]}
      />
      <CurrentSeries />
      <AllMessages />
    </div>
  );
}
