import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { ClassHitType } from "../../../types";

export const UpcomingSessionCard = ({ hit }: { hit: ClassHitType }) => {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const { schedule, startDate, endDate, format, topic, language, title } = hit;

  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="mb-4 bg-whi  te rounded-lg overflow-hidden flex w-full h-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col w-full h-full pb-4">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-[180px] object-cover overflow-hidden"
        />

        <div className="flex flex-col gap-6 px-6 pb-4 pt-5 w-full h-fit flex-1">
          <div className="flex flex-col w-full h-full gap-5">
            {/* Attributes */}
            <div className="flex flex-wrap gap-[6px]">
              <p
                className={`${
                  format === "Online" ? "bg-ocean text-white" : "bg-[#EBEBEB]"
                } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
              >
                {format}
              </p>
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {topic}
              </p>
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {language}
              </p>
            </div>

            {/* Meeting Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* Campus */}
                <div className="flex items-center gap-2">
                  <Icon name="map" size={20} color="black" />
                  <p className="text-sm font-semibold">{hit.campus.name}</p>
                </div>

                {/* Meeting Day - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="calendarAlt" size={20} color="black" />
                  <p className="text-sm font-semibold">
                    {formattedStartDate} - {formattedEndDate}
                  </p>
                </div>

                {/* Meeting Time - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="timeFive" size={20} color="black" />
                  <p className="text-sm font-semibold">{schedule} EST</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full h-11 mt-auto">RSVP</Button>
        </div>
      </div>
    </div>
  );
};
