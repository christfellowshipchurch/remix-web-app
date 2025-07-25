import Icon from "~/primitives/icon";
import { GroupHit } from "../../types";
import { Link } from "react-router-dom";

export const defaultLeaderPhoto =
  "https://cloudfront.christfellowship.church/GetAvatar.ashx?PhotoId=&AgeClassification=Adult&Gender=Unknown&RecordTypeId=1&Text=JC&Size=180&Style=icon&BackgroundColor=E4E4E7&ForegroundColor=A1A1AA";

export function HitComponent({ hit }: { hit: GroupHit }) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const preference = hit.preferences[0];

  // Format the date time to show just time with AM/PM and timezone
  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");

      // Get timezone abbreviation and shorten it
      const timeZone =
        date
          .toLocaleTimeString("en-US", {
            timeZoneName: "short",
          })
          .split(" ")
          .pop() || "";

      // Shorten timezone abbreviations
      const shortTimeZone = timeZone
        .replace("EST", "ET")
        .replace("EDT", "ET")
        .replace("CST", "CT")
        .replace("CDT", "CT")
        .replace("MST", "MT")
        .replace("MDT", "MT")
        .replace("PST", "PT")
        .replace("PDT", "PT");

      return `${displayHours}:${displayMinutes}${ampm} ${shortTimeZone}`;
    } catch (error) {
      // Fallback to original format if parsing fails
      return dateTimeString;
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
    const isDayOfWeek = daysOfWeek.some((day) => hit.meetingDay.includes(day));

    return isDayOfWeek ? hit.meetingDay.slice(0, 3) : hit.meetingDay;
  })();
  const formattedMeetingTime = formatTime(hit.dateTime);

  const meetingInfo = formattedMeetingDay + " " + formattedMeetingTime;

  return (
    <Link to={`/group-finder/${hit.title}`} className="size-full">
      <div
        className="mb-4 bg-white rounded-lg overflow-hidden w-full h-[376px] max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px] cursor-pointer hover:translate-y-[-2px] transition-all duration-300"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col h-full">
          <div className="relative flex flex-col gap-2 xl:pb-0">
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
                  src={hit.leaders[0].photo.uri || defaultLeaderPhoto}
                  alt={hit.leaders[0].firstName}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-[10px] h-full justify-between">
            <div className="flex flex-col px-6 justify-between h-full gap-3">
              <div className="flex flex-col gap-[10px]">
                <div
                  className={`${
                    // TODO: Update the preference to the actual preference once updated
                    preference === "Sisterhood"
                      ? "bg-peach/15 text-[#B33A1B]"
                      : preference === "Crew"
                      ? "bg-cotton-candy/15 text-cotton-candy"
                      : preference === "Everyone"
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

            {/* TOOD: Separate tags and map them into TagButton */}
            <div className="flex px-6 gap-2 pb-4">
              {hit.subPreferences.map((subPreference, index) => (
                <TagButton key={index} label={subPreference} />
              ))}
            </div>
          </div>

          <div className="w-full px-6 flex justify-center gap-2 py-3 bg-navy text-white">
            <Icon name="map" size={20} color="white" />
            <p className="text-center text-sm font-semibold">
              {hit.campusName}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const TagButton = ({ label }: { label: string }) => {
  return (
    <div className="bg-navy-subdued text-dark-navy w-fit flex rounded-sm text-xs font-semibold p-1">
      {label}
    </div>
  );
};
