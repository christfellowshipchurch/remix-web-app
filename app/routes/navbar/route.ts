import type { LoaderFunctionArgs } from "react-router";
import {
  ministriesData,
  watchReadListenData,
} from "~/components/navbar/navbar.data";

export async function loader({ request }: LoaderFunctionArgs) {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    ministries: {
      featureCards: ministriesData.content.featureCards,
    },
    watchReadListen: {
      featureCards: watchReadListenData.content.featureCards,
    },
  };
}

// This is a resource route - no UI needed
export default function NavbarRoute() {
  return null;
}
