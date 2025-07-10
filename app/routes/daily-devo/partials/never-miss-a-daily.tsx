import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

import { appleLink, googleLink, isAppleDevice } from "~/lib/utils";
import {
  FloatingCard,
  FloatingCardType,
} from "../components/floating-card.component";

export const NeverMissADaily = () => {
  return (
    <div className="w-full content-padding pt-32 pb-36">
      <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center gap-8 relative">
        <div className="flex flex-col items-center gap-2 text-black text-center">
          <h2 className="text-[32px] text-xl font-extrabold">
            Never Miss a Daily Devotional
          </h2>
          <p className="text-lg font-medium max-w-[556px]">
            Download our app to receive daily devotionals, track your spiritual
            growth, and build a consistent habit of time with God.
          </p>
        </div>

        <div className="flex flex-col items-center w-full gap-8 max-w-[700px] mt-16 md:mt-0">
          <img
            src="/assets/images/daily/daily-sample-week.png"
            alt="Sample Week"
            className="w-full md:w-[90%] aspect-[61/8]"
          />

          <Button
            onClick={() =>
              window.open(isAppleDevice() ? appleLink : googleLink, "_blank")
            }
            className="w-[280px] flex gap-2 items-center justify-center"
          >
            <Icon name="bible" />
            Start Your Streak Today
          </Button>
        </div>

        {floatingCardData.map((card, index) => (
          <FloatingCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

const floatingCardData: FloatingCardType[] = [
  {
    title: "Pray alongside your community",
    subtitle: "Pray for Others",
    icon: "handsPraying",
  },
  {
    title: "What are your grateful for?",
    subtitle: "Practice Gratitude",
    icon: "handsClapping",
  },
  {
    title: "People are journaling",
    subtitle: "Ready Scripture",
    icon: "bookOpenText",
  },
];
