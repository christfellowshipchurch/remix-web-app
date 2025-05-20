import { Hit } from "algoliasearch";
import { Link } from "react-router-dom";
import { formattedServiceTimes } from "~/lib/utils";
import Icon from "~/primitives/icon";

export type CampusHit = {
  campusUrl: string;
  campusName: string;
  geoloc: {
    latitude: number;
    longitude: number;
  };
  campusLocation: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  };
  serviceTimes: string;
};
export function HitComponent({ hit }: { hit: Hit<CampusHit> }) {
  const { street1, street2, city } = hit.campusLocation;

  return (
    <Link
      to={`/locations/${hit.campusUrl}`}
      prefetch="intent"
      className="flex gap-2 w-full p-2"
    >
      <Icon name="map" color="#666666" size={20} />
      <div className="flex flex-col">
        <h3 className="text-xs text-black font-bold">{hit.campusName}</h3>
        <p className="text-xs font-medium text-text-secondary">
          {street1} {street2}, {city}
        </p>
        <p className="text-xs text-black font-semibold">
          {formattedServiceTimes(hit.serviceTimes).map((service, index) => (
            <span key={index}>
              {service.day} at {service.hour.join(", ")}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
}
