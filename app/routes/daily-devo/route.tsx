import { AppSection } from "../home/partials/app.partial";
import { DailyContent } from "./partials/daily-content";
import { DailyHero } from "./partials/daily-hero";
import { NeverMissADaily } from "./partials/never-miss-a-daily";

export { loader } from "./loader";
export { meta } from "./meta";

export default function DailyDevoPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <DailyHero />
      <DailyContent />
      <NeverMissADaily />

      <AppSection
        layout="imageLeft"
        className="bg-gradient-to-b from-[#00354D] via-[#00354D]/50 to-navy"
        dynamicButton={true}
      />
    </div>
  );
}
