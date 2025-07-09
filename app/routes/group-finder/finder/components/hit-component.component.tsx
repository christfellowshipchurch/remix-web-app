import Icon from "~/primitives/icon";
import { GroupHit } from "../../types";
import { Link } from "react-router-dom";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function HitComponent({ hit }: { hit: GroupHit }) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const meetingType = hit.meetingType;
  const tags = hit.preferences.join(", ");

  return (
    <Link to={`/group-finder/${hit.title}`} className="size-full">
      <div
        className="mb-4 bg-white rounded-lg overflow-hidden w-full h-[376px] max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px] cursor-pointer hover:translate-y-[-2px] transition-all duration-300"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col h-full pb-4">
          <div className="relative flex flex-col gap-2 xl:pb-0">
            <img
              src={coverImage}
              alt={hit.title}
              className="w-full h-[140px] object-cover overflow-hidden"
            />
            <div className="flex gap-1 absolute -bottom-4 lg:-bottom-2 xl:-bottom-4 right-4">
              {hit?.leaders[0] && (
                <img
                  className="rounded-lg border-[1.534px] border-[#EBEBEF] size-[77px] object-cover"
                  style={{
                    boxShadow:
                      "0px 5.114px 10.228px -2.557px rgba(0, 0, 0, 0.10), 0px 2.557px 5.114px -2.557px rgba(0, 0, 0, 0.06)",
                  }}
                  src={hit.leaders[0].photo.uri || defaultLeaderPhoto}
                  alt={hit.leaders[0].firstName}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col px-6 py-3 h-full justify-between">
            <div className="flex flex-col justify-between h-full gap-2">
              <div className="flex flex-col gap-[10px]">
                <div
                  className={`${
                    meetingType === "Virtual"
                      ? "bg-ocean text-white"
                      : "bg-[#EBEBEB]"
                  } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
                >
                  {meetingType}
                </div>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-lg font-bold leading-6 line-clamp-3">
                    {hit.title}
                  </h3>
                  <p className="text-sm text-black">{tags}</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon name="calendarAlt" size={20} color="black" />
                    <p className="text-sm font-semibold">{hit.meetingDay}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon name="map" size={20} color="black" />
                    <p className="text-sm font-semibold">{hit.campusName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
