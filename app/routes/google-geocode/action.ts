import { ActionFunction, json } from "@remix-run/node";
import { LocationSearchCoordinatesType } from "../locations/locationSearch/location-search";

export const action: ActionFunction = async ({ request }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const formData = Object.fromEntries(await request.formData());
  const address = formData.address as string;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
  );
  const data: LocationSearchCoordinatesType = (await response?.json()) as any;

  return json(data);
};
