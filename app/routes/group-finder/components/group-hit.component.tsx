import Icon from "~/primitives/icon";
import { GroupType } from "../types";
import { Link } from "react-router-dom";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function GroupHit({
  hit,
  fromGroupFinderUrl,
}: {
  hit: GroupType;
  fromGroupFinderUrl?: string;
}) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const preference = hit.groupFor;

  // Format the time string to show time with AM/PM and timezone
  const formatTime = (timeString: string) => {
    // If the time string already contains AM/PM, return it as is
    if (
      timeString.toLowerCase().includes("am") ||
      timeString.toLowerCase().includes("pm")
    ) {
      return timeString;
    }

    try {
      const [hoursStr, minutesStr] = timeString.split(":");
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr || "0", 10);

      if (isNaN(hours) || isNaN(minutes)) return timeString;

      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");

      // Get current timezone abbreviation
      const timeZone =
        new Date()
          .toLocaleTimeString("en-US", { timeZoneName: "short" })
          .split(" ")
          .pop() || "";

      // Shorten timezone abbreviations
      const shortTimeZone = timeZone
        .replace(/E[SD]T/, "ET")
        .replace(/C[SD]T/, "CT")
        .replace(/M[SD]T/, "MT")
        .replace(/P[SD]T/, "PT");

      return `${displayHours}:${displayMinutes}${ampm} ${shortTimeZone}`;
    } catch {
      return timeString;
    }
  };

  const formattedMeetingDay = (() => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const isDayOfWeek = daysOfWeek.some((day) => hit.meetingDays.includes(day));
    return isDayOfWeek ? hit.meetingDays.slice(0, 3) : hit.meetingDays;
  })();
  const formattedMeetingTime = formatTime(hit.meetingTime);

  const meetingInfo = formattedMeetingDay + " " + formattedMeetingTime;

  return (
    <Link
      prefetch="intent"
      to={`/group-finder/${hit.objectID}`}
      state={
        fromGroupFinderUrl ? { fromGroupFinder: fromGroupFinderUrl } : undefined
      }
      className="size-full"
    >
      <div
        className="mb-4 bg-white rounded-lg overflow-hidden h-full w-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px] cursor-pointer hover:translate-y-[-2px] transition-all duration-300"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="relative flex flex-col gap-2">
            <img
              src={coverImage}
              alt={hit.title}
              className="w-full h-[140px] object-cover overflow-hidden"
            />

            <div className="flex gap-1 absolute -bottom-4 lg:-bottom-10 xl:-bottom-4 right-4">
              {hit?.leaders[0] && (
                <img
                  className="rounded-lg border-[1.534px] border-[#EBEBEF] size-[77px] object-cover"
                  style={{
                    boxShadow:
                      "0px 5.114px 10.228px -2.557px rgba(0, 0, 0, 0.10), 0px 2.557px 5.114px -2.557px rgba(0, 0, 0, 0.06)",
                  }}
                  src={
                    hit.leaders[0].photo.sources[0].uri || defaultLeaderPhoto
                  }
                  alt={hit.leaders[0].firstName}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-[10px] flex-1">
            <div className="flex flex-col px-6 gap-3">
              <div className="flex flex-col gap-[10px]">
                <div
                  className={`${
                    preference === "Women"
                      ? "bg-peach/15 text-[#B33A1B]"
                      : preference === "Men"
                      ? "bg-cotton-candy/15 text-cotton-candy"
                      : preference === "Anyone"
                      ? "bg-ocean/15 text-ocean"
                      : // Couples
                        "bg-lemon/35 text-[#937200]"
                  } w-fit flex rounded-sm text-xs font-semibold px-2 py-1`}
                >
                  {preference}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold leading-6 line-clamp-2">
                  {hit.title}
                </h3>
                <p className="text-sm text-black">{meetingInfo}</p>
              </div>
            </div>

            {/* Display topics as tags */}
            <div className="flex flex-wrap px-6 gap-x-2">
              {hit.topics.map((topic: string, index: number) => (
                <TagButton key={index} label={topic} />
              ))}
            </div>
          </div>
          <div className="w-full px-6 flex items-center justify-center gap-2 py-3 bg-navy text-white mt-auto">
            <Icon name="map" size={20} color="white" />
            <p className="text-sm font-semibold">{hit.campus}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const TagButton = ({ label }: { label: string }) => {
  return (
    <div className="bg-navy-subdued text-dark-navy flex-shrink-0 h-6 rounded-sm text-xs font-semibold p-1 mb-2">
      {label}
    </div>
  );
};
