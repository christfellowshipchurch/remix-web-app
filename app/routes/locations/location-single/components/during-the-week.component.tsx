import { Link } from "react-router-dom";
import { Icon } from "~/primitives/icon/icon";
import { weekdaySpanishTranslation } from "../util";

export const DuringTheWeek = ({
  weekdaySchedule,
  isSpanish,
}: {
  weekdaySchedule: {
    day: string;
    events: {
      event: string;
      time: string;
      url: string;
    }[];
  }[];
  isSpanish?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-[1rem] px-6 md:px-8 py-4 border border-neutral-lighter w-full">
      <h3 className="text-lg lg:text-[16px] font-semibold">
        {isSpanish ? "Durante la semana" : "During the Week"}
      </h3>
      {/* Schedules */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
        {weekdaySchedule?.map((schedule, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h4 className="font-semibold lg:text-xs">
              {isSpanish ? weekdaySpanishTranslation(schedule.day) : schedule.day}
            </h4>
            <div className="flex flex-col md:gap-2">
              {schedule?.events?.map((event, i) => (
                <p
                  key={i}
                  className="text-[#666666] lg:text-xs font-medium md:max-w-[260px] lg:max-w-[180px]"
                >
                  {event.time} | {event.event}{" "}
                  <Link to={event?.url} className="inline align-middle">
                    <Icon
                      name="linkExternal"
                      size={16}
                      className="text-ocean inline-block align-middle mb-[3px]"
                    />
                  </Link>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
