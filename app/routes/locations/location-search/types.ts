import { RockContentChannelItem } from "~/lib/types/rock-types";

export interface RockCampusItem extends RockContentChannelItem {
  location: {
    latitude: number;
    longitude: number;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  };
}
