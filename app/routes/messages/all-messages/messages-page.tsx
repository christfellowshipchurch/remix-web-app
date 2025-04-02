import { DynamicHero } from "~/components";
import CurrentSeries from "./components/current-series.component";
import AllMessages from "./components/all-messages.component";

export default function MessagesPage() {
  return (
    <div>
      <DynamicHero
        imagePath="/assets/images/messages-hero-bg.jpg"
        ctas={[{ href: "#testing", title: "Live Broadcast" }]}
      />
      <CurrentSeries />
      <AllMessages />
    </div>
  );
}
