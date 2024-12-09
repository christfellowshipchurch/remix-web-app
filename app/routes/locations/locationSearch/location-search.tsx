"use client";
import { useEffect, useState } from "react";
import { Search } from "./partials/locations-search-hero.partial";
import { Campus, Locations } from "./partials/locations-list.partial";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { CampusesReturnType } from "./loader";

export type LocationSearchCoordinatesType = {
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
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [locationActive, setLocationActive] = useState(true);
  const [results, setResults] = useState<Campus[]>([]);

  const campusFetcher = useFetcher();
  const googleFetcher = useFetcher();

  const { campuses } = useLoaderData<CampusesReturnType>();

  useEffect(() => {
    if (coordinates?.length > 0) {
      const formData = new FormData();
      formData.append(
        "latitude",
        coordinates[0].geometry.location.lat.toString()
      );
      formData.append(
        "longitude",
        coordinates[0].geometry.location.lng.toString()
      );

      try {
        campusFetcher.submit(formData, {
          method: "post",
          action: "/locations",
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (campusFetcher.data) {
      if (Array.isArray(campusFetcher.data)) {
        setResults(campusFetcher.data as Campus[]);
      }
    }
  }, [campusFetcher.data]);

  useEffect(() => {
    if (googleFetcher.data) {
      setCoordinates(
        (googleFetcher.data as LocationSearchCoordinatesType).results
      );
    }
  }, [googleFetcher.data]);

  useEffect(() => {
    searchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCoordinates = async () => {
    if (address) {
      const formData = new FormData();
      formData.append("address", address);

      try {
        googleFetcher.submit(formData, {
          method: "post",
          action: "/google-geocode",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      setCoordinates([]);
    }
  };

  function searchScroll() {
    let scrollTo = document.getElementById("campuses");
    if (scrollTo) {
      scrollTo.scrollIntoView({ behavior: "smooth" });
    }
  }

  function searchCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationActive(true);
        searchScroll();
        setCoordinates([
          {
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          },
        ]);
      },
      (error) => {
        if (hasLoaded) {
          setLocationActive(false);
        }
        setHasLoaded(true);
        console.log(error);
        setResults(campuses);
      }
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Search
        searchScroll={searchScroll}
        searchCurrentLocation={searchCurrentLocation}
        setAddress={setAddress}
        getCoordinates={getCoordinates}
        locationActive={locationActive}
      />
      <Locations
        campuses={results}
        loading={
          !results ||
          results.length === 0 ||
          campusFetcher.state === "loading" ||
          googleFetcher.state === "loading"
        }
      />
    </div>
  );
}
