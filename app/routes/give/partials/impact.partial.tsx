import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";
import { Video } from "~/primitives/video/video.primitive";

export const GivingImpact = () => {
  return (
    <div
      className="w-full py-12 md:py-24 bg-[#F6F6F6] content-padding text-center"
      id="give-impact"
    >
      <div className="flex flex-col gap-8 md:gap-16 items-center mx-auto max-w-screen-content">
        <h2 className="text-[32px] md:text-[52px] text-navy font-bold leading-tight max-w-[1100px] mx-auto">
          When you give, you’re impacting others with the love and message of
          Jesus Christ.
        </h2>

        <div className="flex flex-col-reverse md:flex-col gap-8 lg:gap-16 w-full">
          {/* Icon Cards */}
          <div className="flex flex-col items-center justify-center lg:flex-row gap-8 lg:gap-4 2xl:gap-16 w-full">
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-4 2xl:gap-16">
              <IconCard
                icon="church"
                title="Church <br/> Operations"
                description="From maintaining our facilities, supporting our staff, and carrying out various ministries effectively, we’re able to bring the love and message of Jesus to our region."
              />
              <IconCard
                icon="calendarAlt"
                title="Weekly Ministry <br/>Offerings"
                description="We have ministry offerings for the entire family all throughout the week to help people grow in community and in their relationship with God."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-4 2xl:gap-16">
              <IconCard
                icon="paperPlane"
                title="Local and Global <br/>Missions"
                description="Through service projects, trips, and supporting our partners, we’re able to serve others at their point of need and share the love of Jesus in tangible ways."
              />
              <IconCard
                icon="laptop"
                title="Digital <br/>Resources"
                description="With weekly live online services and other digital resources like online groups and classes, and free articles and devotionals, people can grow in their faith from anywhere. "
              />
            </div>
          </div>

          {/* Video Cards */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 md:overflow-x-hidden items-center md:justify-center gap-4 md:gap-6 lg:gap-10 w-full">
            {videoData.map((video, index) => (
              <VideoCard key={index} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const IconCard = ({
  icon,
  title,
  description,
}: {
  icon: keyof typeof icons;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2 md:gap-6 w-full sm:min-w-[246px] max-w-[246px]">
      <Icon name={icon} className="size-16 md:size-[81px] text-ocean" />
      <h3
        className="text-xl md:text-[24px] font-bold leading-tight text-ocean"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p
        className="leading-tight"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

const VideoCard = ({ video }: { video: string }) => {
  return (
    <Video
      wistiaId={video}
      className="w-full h-full max-h-[349px] max-w-[540px] min-w-[300px] min-h-[200px] md:min-h-[349px] md:min-w-[540px] rounded-[6px] overflow-hidden"
    />
  );
};

const videoData = ["ieybr1sv38", "ieybr1sv38"];
