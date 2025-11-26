import lodash from "lodash";
import LocationCard from "../components/locations-search-card.component";
import { LocationsLoader } from "../components/locations-search-skeleton.component";
import { Link } from "react-router-dom";
import { useHits } from "react-instantsearch";

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
  campusImage?: string;
  _rankingInfo?: {
    distance?: number;
  };
};

export type LocationCardListProps = {
  loading: boolean;
};

export const LocationCardList = ({ loading }: LocationCardListProps) => {
  const { items } = useHits<CampusHit>();
  const onlineCampus = items?.find((item) =>
    item.campusName?.includes("Online")
  );
  const filteredItems = items?.filter(
    (item) => !item.campusName?.includes("Online")
  );

  if (loading) {
    return <LocationsLoader />;
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-center py-12 md:px-5 lg:px-2"
      id="campuses"
    >
      {/* Hits */}
      <div className="grid max-w-[1100px] grid-cols-12 gap-5 md:gap-y-10">
        {onlineCampus && (
          <LocationCard
            name="Online"
            image={onlineCampus?.campusImage || ""}
            distanceFromLocation={0}
            key={onlineCampus?.objectID}
            link="/locations/cf-everywhere"
          />
        )}

        {filteredItems?.map((hit, index) => {
          let url = "";
          if (hit?.campusName?.includes("Español")) {
            url = hit?.campusName.substring(25, hit?.campusName.length);
          } else if (hit?.campusName?.includes("Online")) {
            url = "cf-everywhere";
          }

          // Converting the distance from meters to miles
          const distanceFromLocation = hit?._rankingInfo?.geoDistance
            ? hit?._rankingInfo?.geoDistance / 1609.34
            : undefined;

          return (
            <LocationCard
              name={hit?.campusName}
              image={hit?.campusImage || ""}
              distanceFromLocation={distanceFromLocation}
              key={hit.objectID || index}
              link={
                hit?.campusName?.includes("Online")
                  ? `/${url}`
                  : !hit?.campusName.includes("Español")
                  ? `/${lodash.kebabCase(hit?.campusName)}`
                  : `/iglesia-${lodash.kebabCase(url)}`
              }
            />
          );
        })}
      </div>

      {/* Prison Location */}
      <div className="mt-24">
        <Link to="/ministries/prison" prefetch="intent">
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
