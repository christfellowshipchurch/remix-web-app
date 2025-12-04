import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";

const amenities: { title: string; icon: keyof typeof icons }[] = [
  {
    title: "Free Parking",
    icon: "car",
  },
  {
    title: "Clean Restrooms",
    icon: "maleFemale",
  },
  {
    title: "Accessible Entrances & Seating",
    icon: "handicap",
  },
  {
    title: "Helpful Greeters & Ushers",
    icon: "happy",
  },
  {
    title: "Kids Ministry",
    icon: "face",
  },
  {
    title: "Family/Nursing Room",
    icon: "universalAccess",
  },
  {
    title: "Free Wifi",
    icon: "wifi",
  },
  {
    title: "Security & First Aid",
    icon: "shield",
  },
];

export const CampusAmenities = () => {
  return (
    <div className="w-full bg-gray pt-8 pb-28 content-padding flex justify-center">
      <div className="w-ful flex flex-col gap-6 md:items-center md:justify-center max-w-screen-content md:mx-auto">
        <h2 className="font-extrabold text-2xl">Campus Amenities</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12 md:max-w-[1100px] md:flex-wrap gap-y-6">
          {amenities.map((amenity, index) => (
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
