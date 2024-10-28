"use client";
import { useEffect, useState } from "react";
import { Search } from "./partials/locations-search-hero.partial";
import { useLoaderData } from "@remix-run/react";
import { clientLoader } from "./clientLoader";

export type LocationSearchResultsType = {
  results: [
    {
      geometry: {
        location: {
          latitutde: number;
          longitude: number;
        };
      };
    }
  ];
};

export function LocationSearchPage() {
  const [address, setAddress] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [locationActive, setLocationActive] = useState(true);

  const data = useLoaderData<typeof clientLoader>();
  // Pass in the following: {
  //   latitude: results[0].geometry.location.lat,
  //   longitude: results[0].geometry.location.lng,
  // }

  useEffect(() => {
    searchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Gets coordinates from user inputted address
  const getCoordinates = async () => {
    if (address) {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
      );
      const data: LocationSearchResultsType = (await response?.json()) as any;
      setResults(data?.results);
    } else {
      // if no address is entered, set results to an empty array
      setResults([{ geometry: { location: {} } }]);
    }
  };

  function searchScroll() {
    let scrollTo = document.getElementById("results");
    if (scrollTo) {
      scrollTo.scrollIntoView({ behavior: "smooth" });
    }
  }

  function searchCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationActive(true);
        setResults([
          {
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          },
        ]);
        if (hasLoaded) {
          searchScroll();
        }
      },
      (error) => {
        if (hasLoaded) {
          setLocationActive(false);
        }
        setHasLoaded(true);
        console.log(error);
      }
    );
  }

  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <Search
        searchScroll={searchScroll}
        searchCurrentLocation={searchCurrentLocation}
        setAddress={setAddress}
        // refetch={refetch}
        getCoordinates={getCoordinates}
        locationActive={locationActive}
      />
      {/* Search Section */}
      {/* <Locations data={data} loading={!data || data?.length === 0} /> */}
    </div>
  );
}
