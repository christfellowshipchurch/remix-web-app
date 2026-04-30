import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";
import { GroupType, splitGroupTopics } from "../types";
import { Link } from "react-router-dom";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function GroupHit({
  hit,
  backUrl,
}: {
  hit: GroupType;
  backUrl?: string;
}) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const preference = hit.groupFor?.trim() || "Anyone";
  const topicTags = splitGroupTopics(hit.topics);

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
    const day = hit.meetingDay || "";
    const isDayOfWeek = daysOfWeek.some((d) => day.includes(d));
    return isDayOfWeek ? day.slice(0, 3) : day;
  })();
  const formattedMeetingTime = formatTime(hit.meetingTime);

  const meetingInfo = formattedMeetingDay + " " + formattedMeetingTime;

  const leaders = Array.isArray(hit.leaders) ? hit.leaders : [];
  const firstLeader = leaders[0];
  const leaderPhotoUri =
    firstLeader?.photo?.sources?.[0]?.uri ?? defaultLeaderPhoto;

  // TODO: Replace ObjectID with groupGUID later once in Algolia
  return (
    <Link
      prefetch="intent"
      to={`/group-finder/${hit.objectID}`}
      state={backUrl ? { fromGroupFinder: backUrl } : undefined}
      className="flex h-full min-h-0 w-full max-w-full flex-col"
    >
      <div
        className={cn(
          "mx-auto flex h-full min-h-0 w-full max-w-[360px] flex-1 cursor-pointer flex-col rounded-lg",
          "md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]",
          "transition-transform duration-300 ease-out",
          "hover:-translate-y-1",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white">
          <div className="relative flex flex-col gap-2">
            <img
              src={coverImage}
              alt={hit.title}
              className="w-full h-[140px] object-cover overflow-hidden"
            />

            <div className="flex gap-1 absolute -bottom-4 lg:-bottom-10 xl:-bottom-4 right-4">
              {firstLeader ? (
                <img
                  className="rounded-lg border-[1.534px] border-[#EBEBEF] size-[77px] object-cover"
                  style={{
                    boxShadow:
                      "0px 5.114px 10.228px -2.557px rgba(0, 0, 0, 0.10), 0px 2.557px 5.114px -2.557px rgba(0, 0, 0, 0.06)",
                  }}
                  src={leaderPhotoUri}
                  alt={firstLeader.firstName}
                />
              ) : null}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 pt-[10px]">
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
              {topicTags.map((topic, index) => (
                <TagButton key={index} label={topic} />
              ))}
            </div>
          </div>
          <div className="w-full px-6 flex items-center justify-center gap-2 py-3 bg-navy text-white mt-auto">
            <Icon name="map" size={20} color="white" />
            <p className="text-sm font-semibold">{hit.campusName}</p>
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
