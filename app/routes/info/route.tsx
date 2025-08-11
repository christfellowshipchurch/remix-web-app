import { Content } from "./partials/content";
import { Hero } from "./partials/hero";

export default function InfoPage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Content />
    </div>
  );
}
