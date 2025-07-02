import Icon from "~/primitives/icon";
import { Button } from "~/primitives/button/button.primitive";
import { icons } from "~/lib/icons";
import { defaultLeaderPhoto } from "../../finder/components/hit-component.component";

const Divider = () => (
  <div className="w-full h-[1px] bg-[#6E6E6E] opacity-10" role="separator" />
);

interface InfoItemProps {
  icon: keyof typeof icons;
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const InfoItem = ({
  icon,
  color = "#0092BC",
  children,
  style,
}: InfoItemProps) => (
  <div className="flex items-center gap-2 py-4 px-6 lg:p-6" style={style}>
    <Icon name={icon} color={color} size={24} />
    <div className="flex flex-col">{children}</div>
  </div>
);

interface LeaderGalleryProps {
  leaders: {
    firstName: string;
    lastName: string;
    photo: { uri: string };
  }[];
}

const LeaderGallery = ({ leaders }: LeaderGalleryProps) => (
  <div className="flex flex-col gap-2 px-6">
    <div className="flex gap-2">
      {leaders?.map((leader) => (
        <img
          key={leader.firstName}
          src={leader.photo.uri || defaultLeaderPhoto}
          alt={`Group leader ${leader.firstName} ${leader.lastName}`}
          className="w-24 h-24 rounded-xl object-cover"
          loading="lazy"
        />
      ))}
    </div>
    <h2 className="text-sm font-semibold text-text-secondary">Hosted by</h2>
    <div className="lg:text-lg font-bold">
      {leaders
        ?.map((leader) => `${leader.firstName} ${leader.lastName}`)
        .join(" & ")}
    </div>
  </div>
);

interface ContactSectionProps {
  onJoinGroup: () => void;
  onMessageLeader: () => void;
}

const ContactSection = ({
  onJoinGroup,
  onMessageLeader,
}: ContactSectionProps) => (
  <div className="bg-dark-navy w-full rounded-b-[1rem] md:rounded-b-none md:!rounded-r-[1rem] lg:!rounded-none lg:w-auto flex flex-col justify-center lg:justify-start gap-4 md:gap-6 py-8 px-6">
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-white">More Information</h3>
        <p className="text-neutral-lighter">
          If you need any help, please feel free to contact us.
        </p>
      </div>
      <a
        href="mailto:groups@christfellowship.church"
        className="text-white underline hover:cursor-pointer hover:text-opacity-80 transition-colors"
        aria-label="Email us at groups@christfellowship.church"
      >
        groups@christfellowship.church
      </a>
    </div>
    <div className="flex flex-col gap-4 lg:gap-6">
      <Button
        intent="primary"
        onClick={onJoinGroup}
        className="w-full h-auto hover:!bg-white hover:text-navy transition-colors"
      >
        Join Group
      </Button>
      <Button
        intent="primary"
        onClick={onMessageLeader}
        className="w-full h-auto hover:!bg-white hover:text-navy transition-colors"
      >
        Message Leader
      </Button>
    </div>
  </div>
);

export function GroupSingleSidebar({
  leaders,
  meetingType,
  meetingTime,
  meetingDay,
  campusName,
}: {
  leaders: LeaderGalleryProps["leaders"];
  meetingType: string;
  meetingTime: string;
  meetingDay: string;
  campusName: string;
}) {
  const handleJoinGroup = () => {
    // TODO: Implement join group functionality
    console.log("Join group clicked");
  };

  const handleMessageLeader = () => {
    // TODO: Implement message leader functionality
    console.log("Message leader clicked");
  };

  const formattedMeetingTime = new Date(meetingTime).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <aside
      className={`flex flex-col lg:min-w-[324px] md:flex-row lg:flex-col h-fit w-full lg:w-auto md:gap-2 lg:gap-0 pt-0 bg-gray rounded-t-[1rem] md:rounded-t-none md:!rounded-l-[1rem] lg:!rounded-none ${
        leaders.length > 0 ? "lg:pt-6" : ""
      }`}
      aria-label="Group information"
    >
      <div
        className={`flex w-full lg:w-auto flex-col gap-4 lg:gap-8 ${
          leaders.length > 0 ? "pt-6 lg:pt-0" : ""
        }`}
      >
        {leaders.length > 0 && <LeaderGallery leaders={leaders} />}

        <div className="flex flex-col mt-2">
          {leaders.length > 0 && <Divider />}
          <InfoItem
            icon="calendarAlt"
            style={{ display: `${meetingDay ? "flex" : "none"}` }}
          >
            <span className="lg:text-lg font-semibold">{meetingDay}</span>
          </InfoItem>

          <Divider />
          <InfoItem
            icon="alarm"
            style={{ display: `${meetingTime ? "flex" : "none"}` }}
          >
            <span className="lg:text-lg font-semibold">
              {formattedMeetingTime}
            </span>
          </InfoItem>

          <Divider />
          <InfoItem icon="map">
            <span className="text-sm text-text-secondary">{meetingType}</span>
            <span className="lg:text-lg font-semibold">{campusName}</span>
          </InfoItem>
        </div>
      </div>

      <ContactSection
        onJoinGroup={handleJoinGroup}
        onMessageLeader={handleMessageLeader}
      />
    </aside>
  );
}
