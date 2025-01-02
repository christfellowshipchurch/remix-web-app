import { DynamicHero } from "~/components/dynamic-hero";
import CurrentSeries from "./components/current-messages.component";
import AllMessages from "./components/messages.component";

export default function MessagesPage() {
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
