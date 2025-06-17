import Icon from "~/primitives/icon";
import { GroupHit } from "../../types";
import { Link } from "react-router";
import { Button } from "~/primitives/button/button.primitive";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function HitComponent({ hit }: { hit: GroupHit }) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const meetingType = hit.meetingType;

  return (
    <Link to={`/group-finder/${hit.title}`} className="size-full">
      <div
        className="mb-4 bg-white rounded-lg overflow-hidden w-full h-fit max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px] cursor-pointer hover:translate-y-[-2px] transition-all duration-300"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col h-full pb-4">
          <img
            src={coverImage}
            alt={hit.title}
            className="w-full h-[250px] lg:h-[180px] object-cover overflow-hidden"
          />

          <div className="flex flex-col gap-6 px-6 pb-4 pt-5 w-full h-fit">
            <div className="flex flex-col w-full h-full gap-5">
              {/* Attributes */}
              <div className="flex flex-wrap gap-[6px]">
                <p
                  className={`${
                    meetingType === "Virtual"
                      ? "bg-ocean text-white"
                      : "bg-[#EBEBEB]"
                  } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
                >
                  {meetingType}
                </p>
                <p
                  className={`${
                    meetingType === "Virtual"
                      ? "bg-ocean text-white"
                      : "bg-[#EBEBEB]"
                  } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
                >
                  {meetingType}
                </p>
                <p
                  className={`${
                    meetingType === "Virtual"
                      ? "bg-ocean text-white"
                      : "bg-[#EBEBEB]"
                  } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
                >
                  {meetingType}
                </p>
              </div>

              {/* Meeting Info */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  {/* Campus */}
                  <div className="flex items-center gap-2">
                    <Icon name="map" size={20} color="black" />
                    <p className="text-sm font-semibold">{hit.campusName}</p>
                  </div>

                  {/* Meeting Day */}
                  <div className="flex items-center gap-2">
                    <Icon name="calendarAlt" size={20} color="black" />
                    <p className="text-sm font-semibold">{hit.meetingDay}</p>
                  </div>

                  {/* Meeting Time */}
                  <div className="flex items-center gap-2">
                    <Icon name="timeFive" size={20} color="black" />
                    <p className="text-sm font-semibold">Sunday at 8:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full h-11">RSVP</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
