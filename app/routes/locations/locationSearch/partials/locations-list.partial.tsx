import { kebabCase } from "lodash";
import LocationCard from "../components/locations-search-card.component";
import { LocationsLoader } from "../components/locations-search-skeleton.component";
import { Link } from "react-router";
import heroBgImgStyles from "~/styles/heroBgImageStyles";

export type Campus = {
  name: string;
  image: string;
  distanceFromLocation?: number;
};

export type LocationsProps = {
  campuses: Campus[];
  loading: boolean;
};

export const Locations = ({ campuses, loading }: LocationsProps) => {
  if (loading) {
    return <LocationsLoader />;
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2"
      id="campuses"
    >
      <div className="grid max-w-[1100px] grid-cols-12 gap-5 md:gap-y-10">
        {campuses?.map((campus, index) => {
          let url = "";
          if (campus?.name?.includes("Español")) {
            url = campus?.name.substring(25, campus?.name.length);
          } else if (campus?.name?.includes("Online")) {
            url = "cf-everywhere";
          }

          return (
            <LocationCard
              name={campus?.name}
              image={campus?.image}
              distanceFromLocation={campus?.distanceFromLocation}
              key={index}
              link={
                campus?.name?.includes("Online")
                  ? `/${url}`
                  : !campus?.name.includes("Español")
                  ? `/${kebabCase(campus?.name)}`
                  : `/iglesia-${kebabCase(url)}`
              }
            />
          );
        })}
      </div>

      {/* Prison Location */}
      <div className="mt-12">
        <Link to="/locations/prison-locations">
          <div className="relative h-[150px] w-[90vw] overflow-hidden rounded-md transition-transform duration-300 md:h-[250px] md:w-[600px] lg:hover:-translate-y-3 bg-cover bg-center bg-no-repeat bg-[url('https://cloudfront.christfellowship.church/Content/Digital%20Platform/Location/prison-location.jpeg')]">
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
