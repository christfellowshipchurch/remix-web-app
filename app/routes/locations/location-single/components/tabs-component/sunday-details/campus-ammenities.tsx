import { Icon } from "~/primitives/icon/icon";
import {
  englishCampusAmenities,
  spanishCampusAmenities,
} from "../../../location-single-data";

export const CampusAmenities = ({ isSpanish }: { isSpanish?: boolean }) => {
  const title = isSpanish ? "Amenidades del Campus" : "Campus Amenities";
  const campusAmenities = isSpanish
    ? spanishCampusAmenities
    : englishCampusAmenities;

  return (
    <div className="w-full bg-gray pt-8 pb-28 content-padding flex justify-center">
      <div className="w-ful flex flex-col gap-6 md:items-center md:justify-center max-w-screen-content md:mx-auto">
        <h2 className="font-extrabold text-2xl">{title}</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12 md:max-w-[1100px] md:flex-wrap gap-y-6">
          {campusAmenities.map((amenity, index) => (
            <div
              key={index}
              className="text-text-secondary font-bold flex md:items-center md:justify-center gap-2"
            >
              <Icon name={amenity.icon} size={36} />
              <h3>{amenity.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
