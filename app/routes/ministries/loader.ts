import { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { createImageUrlFromGuid } from "~/lib/utils";

export type Ministry = {
  title: string;
  description: string;
  image: string;
  url: string;
};

interface MinistryData {
  title: string;
  content: string;
  attributeValues?: {
    heroImage?: { value: string };
    pathname?: { value: string };
  };
}

const mapMinistryChannelItems = async (
  ministriesData: MinistryData[]
): Promise<Ministry[]> => {
  return ministriesData.map((ministry: MinistryData): Ministry => {
    return {
      title: ministry.title,
      description: ministry.content,
      image:
        createImageUrlFromGuid(ministry.attributeValues?.heroImage?.value) ||
        "",
      url: ministry.attributeValues?.pathname?.value || "",
    };
  });
};

export const loader: LoaderFunction = async (): Promise<{
  ministries: Ministry[];
}> => {
  try {
    const ministriesData = await fetchRockData({
      endpoint: "ContentChannelItems",
      queryParams: {
        $filter: "ContentChannelId eq 171 and Status eq '2'", // Approved Ministries Content Channel Items
        $orderby: "Order",
        loadAttributes: "simple",
      },
    });

    if (!ministriesData) {
      throw new Response("Ministries page not found", {
        status: 404,
        statusText: "Not Found",
      });
    }

    //ensure the ministries data is an array
    let ministriesArray = [];
    if (!Array.isArray(ministriesData)) {
      ministriesArray = [ministriesData];
    } else {
      ministriesArray = ministriesData;
    }

    const ministries = await mapMinistryChannelItems(ministriesArray);

    return { ministries };
  } catch (error) {
    console.error("Error in ministries loader:", error);
    throw new Response("Failed to load ministries content", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
