import AllMessages from "./components/all-messages.component";
import CurrentSeries from "./components/current-messages.component";
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
