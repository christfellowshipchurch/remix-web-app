import { Link } from "react-router";
import { Icon } from "~/primitives/icon/icon";

export const DuringTheWeek = ({
  weekdaySchedule,
}: {
  weekdaySchedule: {
    day: string;
    events: {
      event: string;
      time: string;
      url: string;
    }[];
  }[];
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-[1rem] px-8 py-4 border border-neutral-lighter w-full">
      <h3 className="text-lg lg:text-[16px] font-semibold">During the Week</h3>
      {/* Schedules */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16">
        {weekdaySchedule?.map((schedule, i) => (
          <div key={i} className="flex flex-col gap-2">
            <h4 className="font-semibold lg:text-xs">{schedule.day}</h4>
            <div className="flex flex-col md:gap-2">
              {schedule?.events?.map((event, i) => (
                <p
                  key={i}
                  className="text-[#666666] lg:text-xs font-medium flex items-center"
                >
                  {event.time} | {event.event}
                  <Link to={event?.url}>
                    <Icon name="arrowRight" size={16} />
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
