"use client";
import { useEffect, useState } from "react";
import { Search } from "./partials/locations-search-hero.partial";
import { Campus, Locations } from "./partials/locations-list.partial";
import { useFetcher, useLoaderData } from "react-router";
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
  status: string;
  error: string | undefined | null;
};

export function LocationSearchPage() {
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [locationActive, setLocationActive] = useState(true);
  const [results, setResults] = useState<Campus[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        searchScroll();
      } catch (error) {
        setError("An error occurred while fetching campus data");
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
      console.log((googleFetcher.data as LocationSearchCoordinatesType).error);
      if ((googleFetcher.data as LocationSearchCoordinatesType).error) {
        setError(
          (googleFetcher.data as LocationSearchCoordinatesType).error ?? null
        );
      }
    }
  }, [googleFetcher.data]);

  useEffect(() => {
    searchCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValidZip = (zip: string) => /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip);

  const getCoordinates = async () => {
    if (isValidZip(address)) {
      setError(null);
      const formData = new FormData();
      formData.append("address", address);

      try {
        googleFetcher.submit(formData, {
          method: "post",
          action: "/google-geocode",
        });
      } catch (error) {
        setError("Please enter a valid zip code");
        // console.log(error);
      }
    } else {
      setError("Please enter a valid zip code");
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
        setError(null);
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
        searchCurrentLocation={searchCurrentLocation}
        setAddress={setAddress}
        getCoordinates={getCoordinates}
        locationActive={locationActive}
        error={error}
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
