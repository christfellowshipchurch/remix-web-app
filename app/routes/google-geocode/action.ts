import { ActionFunction, data } from "react-router";
import { LocationSearchCoordinatesType } from "../locations/location-search/location-search";
import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/error-types";

export const action: ActionFunction = async ({ request }) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const formData = Object.fromEntries(await request.formData());
    const address = formData.address as string;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocode data");
    }

    const data: LocationSearchCoordinatesType = (await response.json()) as any;

    if (data.status === "ZERO_RESULTS") {
      return { data, error: "Zipcode does not exist, please try again" };
    }

    return data;
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof EncryptionError ||
      error instanceof RockAPIError
    ) {
      return data({ error: error.message }, { status: 400 });
    }
    return data({ error: "An unexpected error occurred" }, { status: 500 });
  }
};
