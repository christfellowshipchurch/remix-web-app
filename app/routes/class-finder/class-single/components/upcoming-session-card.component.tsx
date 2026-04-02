import { Icon } from "~/primitives/icon/icon";
import { ClassHitType } from "../../types";

export const UpcomingSessionCard = ({ hit }: { hit: ClassHitType }) => {
  const campusLabel = hit.campus?.trim() ?? "";
  const campusIcon = campusLabel.toLowerCase().includes("online")
    ? "globe"
    : "map";
  const { schedule, startDate, endDate, format, language, classType } = hit;
  const isVirtualFormat = format === "Virtual";

  const geoMeters = hit._rankingInfo?.geoDistance;
  /** Algolia can send `geoDistance: 0` when `aroundLatLng` is unset; only show miles when geo search is meaningful. */
  const milesFromSearchOrigin =
    geoMeters != null &&
    typeof geoMeters === "number" &&
    !Number.isNaN(geoMeters) &&
    geoMeters > 0
      ? geoMeters / 1609.34
      : null;

  const footerLabel = isVirtualFormat
    ? "Online"
    : milesFromSearchOrigin != null
      ? `${milesFromSearchOrigin.toFixed(1)} MILES`
      : format;

  const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="mb-4 bg-white rounded-lg overflow-hidden flex w-full h-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-6 px-6 pb-1 pt-5 w-full h-fit flex-1">
          <div className="flex flex-col w-full h-full gap-5">
            <div className="flex flex-col gap-2">
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {language}
              </p>
              <h3 className="text-lg font-bold leading-6 line-clamp-2">
                {classType}
              </h3>
            </div>

            {/* Meeting Info */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {/* Campus */}
                <div className="flex items-center gap-2">
                  <Icon name={campusIcon} size={20} color="black" />
                  <p className="text-sm font-semibold">{campusLabel}</p>
                </div>

                {/* Meeting Day - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="calendarAlt" size={20} color="black" />
                  <p className="text-sm font-semibold">
                    {formattedStartDate} - {formattedEndDate}
                  </p>
                </div>

                {/* Meeting Time - Update */}
                <div className="flex items-center gap-2">
                  <Icon name="timeFive" size={20} color="black" />
                  <p className="text-sm font-semibold">{schedule} EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy py-4.5 text-white flex gap-1.5 items-center justify-center">
          <Icon
            name={isVirtualFormat ? "globe" : "locationArrow"}
            size={16}
            className="text-gray"
          />
          <p className="text-sm font-semibold text-gray">{footerLabel}</p>
        </div>
      </div>
    </div>
  );
};
