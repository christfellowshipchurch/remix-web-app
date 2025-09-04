import { CardFeed } from "./partials/card-feed.partial";
import { HeroCardScroll } from "./partials/hero-scroll.partial";

export default function InfoPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroCardScroll />
      <CardFeed />
    </div>
  );
}
