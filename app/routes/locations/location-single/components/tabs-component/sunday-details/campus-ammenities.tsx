import { icons } from "~/lib/icons";
import { Icon } from "~/primitives/icon/icon";

const amenities: { title: string; icon: keyof typeof icons }[] = [
  {
    title: "Accessible Parking",
    icon: "car",
  },
  {
    title: "Accessible Restrooms",
    icon: "maleFemale",
  },
  {
    title: "Accessible Seating & Entrance",
    icon: "handicap",
  },
  {
    title: "Children's Ministry",
    icon: "face",
  },
  {
    title: "Greeters & Ushers",
    icon: "happy",
  },
  {
    title: "Security & First Aid",
    icon: "shield",
  },
  {
    title: "Wifi",
    icon: "wifi",
  },
  {
    title: "Family/Nursing Room",
    icon: "universalAccess",
  },
];

export const CampusAmenities = () => {
  return (
    <div className="w-full bg-gray pt-8 pb-28 content-padding flex justify-center">
      <div className="w-ful flex flex-col gap-6 md:items-center md:justify-center max-w-screen-content md:mx-auto">
        <h2 className="font-extrabold text-2xl">Campus Amenities</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-12 md:flex-wrap gap-y-6">
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
