import { Link } from "react-router-dom";
import { Icon } from "~/primitives/icon/icon";
import { weekdaySpanishTranslation } from "../util";

export type WeeklyMinistryService = {
  minstryType: string;
  dayOfWeek: string;
  serviceTimes: string;
  learnMoreUrl: string;
  planMyvisit: string;
};

export const DuringTheWeek = ({
  weeklyMinistryServices,
  isSpanish,
}: {
  weeklyMinistryServices: WeeklyMinistryService[];
  isSpanish?: boolean;
}) => {
  const byDay = (weeklyMinistryServices ?? []).reduce(
    (acc, item) => {
      const day = item.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, WeeklyMinistryService[]>,
  );
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const orderedDays = dayOrder.filter((day) => byDay[day]?.length);

  return (
    <div className="flex flex-col gap-3 rounded-2xl px-6 md:px-8 py-4 border border-neutral-lighter w-full">
      <h3 className="text-lg lg:text-[16px] font-semibold">
        {isSpanish ? "Durante la semana" : "During the Week"}
      </h3>
      <div className="flex flex-col md:flex-row gap-4 md:gap-1 lg:gap-2 md:justify-between">
        {orderedDays.map((day) => (
          <div key={day} className="flex flex-col gap-2">
            <h4 className="font-semibold lg:text-xs">
              {isSpanish ? weekdaySpanishTranslation(day) : day}
            </h4>
            <div className="flex flex-col md:gap-2">
              {byDay[day].map((ministry, i) => (
                <p
                  key={i}
                  className="text-neutral-default lg:text-xs font-medium md:max-w-[260px] lg:max-w-[180px]"
                >
                  {ministry.serviceTimes} | {ministry.minstryType}{" "}
                  {ministry.learnMoreUrl ? (
                    <Link
                      to={ministry.learnMoreUrl}
                      className="inline align-middle"
                    >
                      <Icon
                        name="linkExternal"
                        size={16}
                        className="text-ocean inline-block align-middle mb-[3px]"
                      />
                    </Link>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
