import { ActionFunction } from "react-router-dom";
import {
  AuthenticationError,
  EncryptionError,
  RockAPIError,
} from "~/lib/.server/error-types";

export type LocationSearchCoordinatesType = {
  results: [
    {
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
    }
  ];
  status: string;
  error: string | undefined | null;
};
export const action: ActionFunction = async ({ request }) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const formData = Object.fromEntries(await request.formData());
    const address = formData.address as string;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch geocode data");
    }

    const data: LocationSearchCoordinatesType = await response.json();

    if (data.status === "ZERO_RESULTS") {
      return Response.json(
        { data, error: "Zipcode does not exist, please try again" },
        { status: 400 }
      );
    }

    return Response.json(data);
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof EncryptionError ||
      error instanceof RockAPIError
    ) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
