import { kebabCase } from "lodash";
import { useState } from "react";
import LocationCard from "./locations-search-card.partial";
import { LocationsLoader } from "./locations-skeleton.partial";
import { Link } from "@remix-run/react";
import prisonLocationImage from "../../../assets/prison-locations.jpg";

const heroBgImgStyles = (image?: string) => {
  return {
    backgroundImage: image?.includes("https")
      ? `url(${image}&width=1200)`
      : image,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

export type Campus = {
  name: string;
  image: {
    uri: string;
  };
  distanceFromLocation?: number;
};

export type LocationsProps = {
  data: {
    getCampuses: Campus[];
  };
  loading: boolean;
};

export const Locations = ({ data, loading }: LocationsProps) => {
  const [onlineCampus, setOnlineCampus] = useState<Campus | null>(null);
  if (loading) {
    return <LocationsLoader />;
  }

  const onlineCampusIndex = data?.getCampuses.findIndex((campus) => {
    return campus.name === "Online (CF Everywhere)";
  });
  if (onlineCampusIndex !== -1 && data?.getCampuses[onlineCampusIndex]) {
    setOnlineCampus(data?.getCampuses[onlineCampusIndex]);
    data?.getCampuses.splice(onlineCampusIndex, 1);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2">
      {/* Turn into grid */}
      <div className="grid max-w-[1100px] grid-cols-12 gap-5 md:gap-y-10">
        {onlineCampus && (
          <LocationCard
            link="cf-everywhere"
            name={onlineCampus?.name}
            image={onlineCampus?.image?.uri}
            distanceFromLocation={onlineCampus?.distanceFromLocation}
          />
        )}
        {data?.getCampuses?.map((campus, index) => {
          let cfe = "";
          if (campus?.name?.includes("Español")) {
            cfe = campus?.name.substring(25, campus?.name.length);
          }
          return (
            <LocationCard
              name={campus?.name}
              image={campus?.image?.uri}
              distanceFromLocation={campus?.distanceFromLocation}
              key={index}
              link={
                !campus?.name.includes("Español")
                  ? `/${kebabCase(campus?.name)}`
                  : `/iglesia-${kebabCase(cfe)}`
              }
            />
          );
        })}
      </div>
      {/* Prison Location */}
      <div className="mt-12">
        <Link to="/locations/prison-locations">
          <div
            style={heroBgImgStyles(prisonLocationImage)}
            className="relative h-[150px] w-[90vw] overflow-hidden rounded-md transition-transform duration-300 md:h-[250px] md:w-[600px] lg:hover:-translate-y-3"
          >
            <div
              className="absolute size-full opacity-80"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), #353535)",
              }}
            />
            <h3 className="absolute bottom-0 left-0 pb-6 pl-6 text-2xl font-bold text-white">
              Prison Locations
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
};
