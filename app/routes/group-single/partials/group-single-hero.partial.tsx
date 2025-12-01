import { cn } from "~/lib/utils";
import { TopicBadge } from "../components/group-single-banner.component";
import { GroupType } from "~/routes/group-finder/types";
import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";

export function GroupSingleHero({ hit }: { hit: GroupType }) {
  const imagePath = hit.coverImage.sources[0].uri;

  return (
    <div
      className={cn(
        "w-full bg-gray relative content-padding pt-10 pb-16 md:pt-16 lg:py-24"
      )}
    >
      <div className="w-full flex flex-col md:flex-row gap-10 lg:gap-8 md:justify-between items-center max-w-screen-content mx-auto">
        {/* Left Side - Desktop, Mobile - EVERYTHING  */}
        <div className="flex flex-col gap-8">
          <div className="flex md:hidden flex-col gap-2">
            <h1 className="text-4xl font-bold">{hit.title}</h1>
            <div className="flex flex-wrap gap-1 w-full">
              {hit.topics.map((topic: string, index: number) => (
                <TopicBadge key={index} label={topic} isPrimary={index === 0} />
              ))}
            </div>
          </div>

          <img
            src={imagePath}
            alt="Group Finder Hero"
            className="w-full lg:hidden max-w-screen aspect-video object-cover rounded-lg"
          />

          <GroupInfo hit={hit} />
        </div>

        {/* Right Side */}
        <img
          src={imagePath}
          alt="Group Finder Hero"
          className="hidden lg:block w-full max-w-[735px] xl:max-w-[935px] aspect-video object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

const GroupInfo = ({ hit }: { hit: GroupType }) => {
  const {
    meetingDays,
    meetingFrequency,
    meetingLocationType,
    meetingLocation,
    meetingTime,
    campus,
    groupFor,
    peopleWhoAre,
    minAge,
    maxAge,
    adultOnly,
    childCareDescription,
  } = hit;

  const formattedMeetingTime = meetingTime.replace(" ", "");
  const meetingLocationLabel = `Group Meets at ${
    meetingLocationType.toLowerCase() === "church"
      ? campus
      : meetingLocationType.toLowerCase()
  }`;
  const groupItemTitle = `${groupFor}${
    peopleWhoAre ? `, ${peopleWhoAre}` : ""
  }`;

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-col gap-8">
      <InfoItem
        title={meetingLocation}
        description={meetingLocationLabel}
        icon="map"
      />
      <InfoItem
        title={groupItemTitle}
        description={`${minAge} - ${maxAge} years old`}
        icon="group"
        isLayoutReversed={true}
      />
      <InfoItem
        title={`${meetingFrequency}, ${meetingDays}s`}
        description={`${formattedMeetingTime} ET`}
        icon="calendarAlt"
        isLayoutReversed={true}
      />
      <InfoItem
        title={adultOnly ? "Adults Only" : "Children Welcome"}
        description={childCareDescription ?? ""}
        icon={adultOnly ? "male" : "child"}
      />
      <InfoItem
        title={campus}
        description="Affiliated Campus Location"
        icon="cfLogo"
      />
    </div>
  );
};

const InfoItem = ({
  description,
  title,
  icon,
  isLayoutReversed,
}: {
  title: string;
  description?: string | undefined;
  icon: keyof typeof icons;
  isLayoutReversed?: boolean;
}) => {
  return (
    <div className="flex items-center gap-[10px] pb-6 border-b border-[#6E6E6E]/10 w-full md:max-w-[42vw]">
      <Icon name={icon} className="text-ocean" />

      <div
        className={`flex ${isLayoutReversed ? "flex-col-reverse" : "flex-col"}`}
      >
        {description ? (
          <span className="text-text-secondary">{description}</span>
        ) : null}
        {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
      </div>
    </div>
  );
};
