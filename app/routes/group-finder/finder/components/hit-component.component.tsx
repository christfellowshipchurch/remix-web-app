import Icon from "~/primitives/icon";
import { GroupHit } from "../../types";
import { useState } from "react";
import { Button } from "~/primitives/button/button.primitive";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function HitComponent({ hit }: { hit: GroupHit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const meetingType = hit.meetingType;
  const tags = hit.preferences.join(", ");

  return (
    <div
      className="h-full mb-4 bg-white rounded-lg overflow-hidden max-w-[306px] xl:max-w-96"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col h-full pb-6">
        <div className="relative flex flex-col gap-2 lg:pb-6 xl:pb-0">
          <img
            src={coverImage}
            alt={hit.title}
            className="w-full h-48 object-cover mb-4 overflow-hidden"
          />
          <div className="flex gap-1 absolute -bottom-4 lg:bottom-2 xl:-bottom-4 right-4">
            {hit?.leaders.map((leader, i) => (
              <img
                className="rounded-lg border-[1.534px] border-[#EBEBEF] size-20 object-cover"
                style={{
                  boxShadow:
                    "0px 5.114px 10.228px -2.557px rgba(0, 0, 0, 0.10), 0px 2.557px 5.114px -2.557px rgba(0, 0, 0, 0.06)",
                }}
                src={leader.photo.uri || defaultLeaderPhoto}
                key={i}
                alt={leader.firstName}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 xl:gap-4 px-4 h-full justify-between">
          <div className="flex flex-col gap-4 lg:gap-6 xl:gap-8">
            <div className="flex flex-col gap-1">
              <div className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {meetingType}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold leading-6">{hit.title}</h3>
                <p className="text-sm text-black">{tags}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon name="map" size={20} color="black" />
                  <p className="text-sm font-semibold">{hit.campusName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Icon name="calendarAlt" size={20} color="black" />
                  <p className="text-sm font-semibold">{hit.meetingDay}</p>
                </div>
                <div>
                  <p className={`text-sm ${isExpanded ? "" : "line-clamp-3"}`}>
                    {hit.summary}
                  </p>
                  {hit.summary.length > 132 && (
                    <button
                      className="text-ocean text-sm font-semibold text-start"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? "See Less" : "See More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            size="sm"
            type="submit"
            intent="primary"
            href={`/group-finder/${encodeURIComponent(hit.title)}`}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
