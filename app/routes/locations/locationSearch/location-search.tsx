"use client";
import { useEffect, useState } from "react";
import { Search } from "./partials/locations-search-hero.partial";
import { Campus, Locations } from "./partials/locations-list.partial";
import { useFetcher } from "@remix-run/react";

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
  const [data, setData] = useState<Campus[]>([]);

  const fetcher = useFetcher();
  const googleFetcher = useFetcher();

  useEffect(() => {
    if (results.length > 0) {
      const formData = new FormData();
      formData.append("latitude", results[0].geometry.location.lat.toString());
      formData.append("longitude", results[0].geometry.location.lng.toString());

      try {
        fetcher.submit(formData, {
          method: "post",
          action: "/locations",
        });
      } catch (error) {
        console.log(error);
      }

      if (fetcher.data) {
        if (Array.isArray(fetcher.data)) {
          setData(fetcher.data as Campus[]);
        }
      }
    }
  }, [results]);

  useEffect(() => {
    searchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gets coordinates from user inputted address
  const getCoordinates = async () => {
    if (address) {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      // TODO: Switch to using fetcher from the Google endpoint in our site
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
        getCoordinates={getCoordinates}
        locationActive={locationActive}
      />
      {/* Locations Section */}
      <Locations campuses={data} loading={!data || data.length === 0} />
    </div>
  );
}
