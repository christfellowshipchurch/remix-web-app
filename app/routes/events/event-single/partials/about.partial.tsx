import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";

export const AboutPartial = ({
  infoCards,
  moreInfo,
  additionalBlurb,
}: {
  moreInfo: string;
  infoCards: InfoCardType[];
  additionalBlurb?: string;
}) => {
  const cardsToDisplay = infoCards.slice(0, 4); // Display only up to 4 cards

  return (
    <section
      className="flex flex-col items-center py-8 md:py-16 content-padding bg-gray w-full"
      id="about"
    >
      <div className="max-w-screen-content mx-auto w-full flex flex-col items-center gap-8 md:gap-14">
        <div className="flex flex-col items-center gap-6 w-full">
          <h2 className="font-extrabold text-center text-[32px]">
            About This Event
          </h2>
          <p className="text-center text-[#717182] text-lg font-medium md:mx-4 max-w-[700px]">
            One to three sentences explaining what the event is in a brief and
            engaging way. This can be a good spot to talk about certain things
            that can be good for events along with other important event
            information.
          </p>

          {/* Info Cards */}
          {cardsToDisplay.length > 1 && (
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6 items-center justify-center w-full">
              {cardsToDisplay.map((card, index) => (
                <InfoCardComponent
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                />
              ))}
            </div>
          )}
        </div>

        {/* More Data */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-8 lg:justify-between w-full pb-6">
          {/* Left / Top (Mobile) Side */}
          <div className="w-full max-w-[590px] flex flex-col gap-4">
            <h3 className="text-xl text-black font-semibold">
              Schedule / What to Expect
            </h3>
            <div className="flex flex-col gap-2 items-start">
              {scheduleItems?.map((item, index) => (
                <ScheduleItem
                  key={index}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          {/* Right / Bot (Mobile) Side */}
          <div className="flex flex-col gap-5 max-w-[640px] w-full">
            <div className="flex flex-col gap-3">
              <h3 className="text-black text-xl font-semibold">More Info</h3>
              <p className="text-[#717182] text-sm font-medium">{moreInfo}</p>
            </div>

            {additionalBlurb && (
              <div className="bg-white border border-[#BEBDC3] rounded-[12px] flex items-center justify-center p-4">
                <p className="text-black">{additionalBlurb}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const scheduleItems = [
  {
    number: "1",
    title: "Welcome & Introduction",
    description:
      "Kick off the event with a warm welcome and an overview of what to expect.",
  },
  {
    number: "2",
    title: "Keynote Speaker",
    description:
      "Hear from our keynote speaker on the latest trends and insights in the industry.",
  },
  {
    number: "3",
    title: "Networking Break",
    description:
      "Take a break to connect with fellow attendees and share ideas.",
  },
  {
    number: "4",
    title: "Workshops & Activities",
    description:
      "Participate in interactive workshops and activities designed to enhance your skills.",
  },
];

const ScheduleItem = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-navy flex items-center justify-center text-center p-2 size-7 rounded-full shrink-0 mt-[2px]">
        <p className="text-white w-full text-center">{number}</p>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-lg text-black">{title}</h4>
        <p className="text-[#717182] text-sm font-medium">{description}</p>
      </div>
    </div>
  );
};

type InfoCardType = {
  title: string;
  description: string;
  icon: keyof typeof icons;
};

const InfoCardComponent = ({ title, description, icon }: InfoCardType) => {
  return (
    <div className="bg-white pb-10 px-4 pt-6 rounded-lg flex flex-col items-center text-center gap-8 border border-[#E5E5E5] w-full max-w-[312px]">
      <div className="bg-ocean flex items-center justify-center text-center p-2 rounded-full">
        <Icon name={icon} className="text-white ml-[2px]" />
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-medium text-lg text-black">{title}</h3>

        <p className="font-medium text-sm md:text-base text-black ">
          {description}
        </p>
      </div>
    </div>
  );
};
