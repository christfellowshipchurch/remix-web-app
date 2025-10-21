import { cn } from "~/lib/utils";
import { TopicBadge } from "../components/group-single-banner.component";
import { GroupType } from "~/routes/group-finder/types";
import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";

export function FinderSingleHero({ hit }: { hit: GroupType }) {
  const imagePath = hit.coverImage.sources[0].uri;

  return (
    <div className={cn("w-full bg-gray relative content-padding py-24")}>
      <div className="w-full flex flex-col md:flex-row gap-8 md:justify-between items-center max-w-screen-content mx-auto">
        {/* Left Side - Desktop, Mobile - EVERYTHING  */}
        <div className="flex flex-col gap-8">
          <div className="flex md:hidden flex-col gap-2">
            <h1 className="text-4xl font-bold">{hit.title}</h1>
            {hit.topics.map((topic: string, index: number) => (
              <TopicBadge key={index} label={topic} isPrimary={index === 0} />
            ))}
          </div>
          <img
            src={imagePath}
            alt="Group Finder Hero"
            className="w-full lg:hidden max-w-screen aspect-video object-cover rounded-[8px]"
          />

          <GroupInfo hit={hit} />
        </div>

        {/* Right Side */}
        <img
          src={imagePath}
          alt="Group Finder Hero"
          className="w-full lg:max-w-[735px] xl:max-w-[935px] aspect-video object-cover rounded-[8px]"
        />
      </div>
    </div>
  );
}

const GroupInfo = ({ hit }: { hit: GroupType }) => {
  const {
    meetingDays,
    meetingTime,
    campus,
    groupFor,
    peopleWhoAre,
    minAge,
    maxAge,
    adultOnly,
    childCareDescription,
  } = hit;

  return (
    <div className="flex flex-col gap-8">
      <InfoItem
        label="Meeting Days"
        value={meetingDays}
        icon="map"
        isTitleReversed={true}
      />
      <InfoItem label="Meeting Days" value={meetingDays} icon="group" />
      <InfoItem label="Meeting Days" value={meetingDays} icon="calendarAlt" />
      <InfoItem
        value={adultOnly ? "Adults Only" : "Children Welcome"}
        label={childCareDescription ?? ""}
        icon="child"
      />
      <InfoItem
        label="Meeting Days"
        value={meetingDays}
        icon="cfLogo"
        isTitleReversed={true}
      />
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
  isTitleReversed,
}: {
  label: string;
  value?: string | undefined;
  icon: keyof typeof icons;
  isTitleReversed?: boolean;
}) => {
  return (
    <div className="flex items-center gap-[10px]">
      <Icon name={icon} className="text-ocean" />

      <div
        className={`flex ${
          isTitleReversed ? "flex-col-reverse" : "flex-col"
        } gap-1`}
      >
        <span className="text-text-secondary">{label}</span>
        {value ? <h3 className="text-lg font-semibold">{value}</h3> : null}
      </div>
    </div>
  );
};
