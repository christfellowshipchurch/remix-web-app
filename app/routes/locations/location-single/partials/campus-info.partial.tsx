import Icon from "~/primitives/icon";
import { VirtualTourTabs } from "../components/virtual-tour.component";
import { DuringTheWeek } from "../components/during-the-week.component";
import { CTAs } from "../components/ctas.component";
import { icons } from "~/lib/icons";
import { dayTimes, formattedServiceTimes } from "~/lib/utils";

interface CampusInfoProps {
  isOnline?: boolean;
  campusName: string;
  digitalTourVideo: string;
  campusLocation?: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    postalCode: string;
  };
  serviceTimes: string;
  weekdaySchedule?: {
    day: string;
    events: {
      event: string;
      time: string;
      url: string;
    }[];
  }[];
  phoneNumber: string;
  additionalInfo: string[];
}

const IconText = ({
  icon,
  text,
  serviceTimes,
}: {
  icon: keyof typeof icons;
  text?: string;
  serviceTimes?: dayTimes[];
}) => (
  <div className="flex gap-2">
    <Icon name={icon} className="text-ocean" />
    {text ? (
      <p className="text-lg font-semibold">{text}</p>
    ) : (
      serviceTimes?.map((time, index) => (
        <p key={index} className="text-lg font-semibold">
          {time.day} | {time.hour.join(", ")}
        </p>
      ))
    )}
  </div>
);

export const CampusInfo = ({
  isOnline,
  campusName,
  digitalTourVideo,
  campusLocation,
  weekdaySchedule,
  phoneNumber,
  additionalInfo,
  serviceTimes,
}: CampusInfoProps) => {
  const address = `${campusLocation?.street1}${
    campusLocation?.street2 ? ` ${campusLocation?.street2}` : ""
  }, ${campusLocation?.city}, ${campusLocation?.state} ${
    campusLocation?.postalCode
  }`;

  if (isOnline) {
    return (
      <OnlineCampusInfo
        campusName={campusName}
        digitalTourVideo={digitalTourVideo}
        phoneNumber={phoneNumber}
        additionalInfo={additionalInfo}
        serviceTimes={serviceTimes}
      />
    );
  }

  let campusHeadingLine = "";
  if (campusName === "CF Everywhere") {
    campusHeadingLine = "Christ Fellowship Church Online";
  } else if (campusName === "Trinity") {
    campusHeadingLine = `Christ Fellowship Church Trinity in Palm Beach Gardens`;
  } else if (campusName.includes("Español") || campusName.includes("Espanol")) {
    const espanolCampusLocation = campusName
      .replace("Español", "")
      .replace("Espanol", "")
      .replace("Christ Fellowship", "")
      .trim();
    campusHeadingLine = `Christ Fellowship Español en ${espanolCampusLocation}, FL`;
  } else {
    campusHeadingLine = `Christ Fellowship Church in ${campusName}, FL`;
  }

  return (
    <div className="w-full content-padding">
      <div className="w-full mx-auto max-w-screen-content flex flex-col lg:flex-row gap-8 lg:justify-between pt-16 pb-20 lg:pb-32">
        {/* Location Info */}
        <div className="flex-1 flex flex-col gap-8 lg:pb-16 max-w-[646px]">
          {/* Campus Name Section*/}
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-2 text-ocean">
              <Icon name="church" className="lg:size-[40px] size-[24px]" />
              <p className="font-medium">Campus Location</p>
            </div>
            <h1 className="text-[#2E2C2D] text-[24px] md:text-[36px] lg:text-[52px] font-extrabold leading-tight">
              {campusHeadingLine}
            </h1>
          </div>

          {/* Important Info Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <IconText
                icon="timeFive"
                serviceTimes={formattedServiceTimes(serviceTimes)}
              />
              <IconText icon="map" text={address} />
              <IconText icon="mobileAlt" text={phoneNumber} />
            </div>

            <div className="flex flex-col">
              {additionalInfo.map((info, index) => (
                <p key={index} className="text-xs text-[#666666]">
                  *{info}
                </p>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-16">
            {/* Desktop CTAs */}
            <div className="hidden lg:flex max-w-[450px] gap-8 flex-col">
              <CTAs />
              {weekdaySchedule && weekdaySchedule.length > 0 && (
                <DuringTheWeek weekdaySchedule={weekdaySchedule} />
              )}
            </div>
          </div>
        </div>

        {/* Tour */}
        <div className="flex-1 lg:pt-16 max-w-[670px]">
          <VirtualTourTabs
            wistiaId={digitalTourVideo || ""}
            address={address}
          />
        </div>

        {/* Mobile CTAs */}
        <div className="flex lg:hidden flex-col max-w-[570px] lg:max-w-[460px] gap-16">
          <CTAs />
          {weekdaySchedule && weekdaySchedule.length > 0 && (
            <DuringTheWeek weekdaySchedule={weekdaySchedule} />
          )}
        </div>
      </div>
    </div>
  );
};

const OnlineCampusInfo = ({
  campusName: _campusName,
  // digitalTourVideo,
  phoneNumber,
  additionalInfo,
  serviceTimes,
}: CampusInfoProps) => {
  return (
    <div className="w-full content-padding">
      <div className="w-full mx-auto max-w-screen-content flex flex-col lg:flex-row gap-8 lg:justify-between pt-16 pb-20 lg:pb-32">
        {/* Location Info */}
        <div className="flex-1 flex flex-col gap-8 lg:pb-16 max-w-[900px]">
          {/* Campus Name Section*/}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-ocean">
              <Icon name="world" className="lg:size-[36px] size-[24px]" />
              <p className="font-medium">Online Community</p>
            </div>
            <h1 className="text-[#2E2C2D] text-[24px] md:text-[36px] lg:text-[52px] font-extrabold leading-tight">
              Christ Fellowship Church Online
            </h1>
          </div>

          {/* Important Info Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <IconText
                icon="timeFive"
                serviceTimes={formattedServiceTimes(serviceTimes)}
              />
              <IconText
                icon="station"
                text="Online Livestream Broadcasting from Palm Beach Gardens "
              />
              <IconText icon="mobileAlt" text={phoneNumber} />
            </div>

            <div className="flex flex-col">
              {additionalInfo.map((info, index) => (
                <p key={index} className="text-xs text-[#666666]">
                  *{info}
                </p>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-16">
            {/* Desktop CTAs */}
            <div className="hidden lg:flex max-w-[450px] gap-8 flex-col">
              <CTAs />
            </div>
          </div>
        </div>

        {/* TODO: Hiding Tour for now */}
        {/* <div className="flex-1 lg:pt-16 max-w-[670px]">
          <VirtualTourTabs wistiaId={digitalTourVideo || ""} isOnline />
        </div> */}

        {/* Mobile CTAs */}
        <div className="flex lg:hidden flex-col max-w-[570px] lg:max-w-[460px] gap-16">
          <CTAs />
        </div>
      </div>
    </div>
  );
};
