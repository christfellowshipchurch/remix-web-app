import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { LoaderFunctionArgs } from "react-router-dom";
import { createImageUrlFromGuid } from "~/lib/utils";
import { MessageType } from "../messages/types";
import { getContentChannelUrl } from "~/lib/rock-config";
import { ensureArray } from "~/lib/utils";
import { mapRockDataToMessage } from "../messages/message-single/loader";

export type LoaderReturnType = {
  series: Series;
  messages: MessageType[];
  // A series resource will be anything tagged with the series defined value that is not a message
  resources: {
    id: string;
    title: string;
    coverImage: string;
    attributeValues: {
      image: { value: string };
      url: { value: string };
    };
    contentChannelId: string;
  }[];
};

export type Series = {
  value: string;
  description: string;
  attributeValues: {
    callToActions: {
      title: string;
      url: string;
    }[];
    coverImage: string;
  };
  guid: string;
};

const getSeries = async (guid: string) => {
  const fetchSeries = await fetchRockData({
    endpoint: "DefinedValues",
    queryParams: {
      $filter: `Guid eq guid'${guid}'`,
      loadAttributes: "simple",
    },
  });

  if (!fetchSeries) {
    return null;
  }

  const series = ensureArray(fetchSeries);

  return series[0];
};

const getSeriesResources = async (seriesGuid: string) => {
  const seriesResources = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "MessageSeries",
      $filter: "ContentChannelId ne 63 and Status eq 'Approved'",
      value: `${seriesGuid}`,
      loadAttributes: "simple",
    },
  });

  if (!seriesResources) {
    return [];
  }

  const resources = Array.isArray(seriesResources)
    ? seriesResources
    : [seriesResources];

  resources.forEach(
    (resource: {
      attributeValues: { image: { value: string } };
      coverImage: string;
    }) => {
      resource.coverImage = createImageUrlFromGuid(
        resource.attributeValues.image.value
      );
    }
  );

  resources.forEach(
    (resource: {
      attributeValues: { url: { value: string } };
      contentChannelId: string;
    }) => {
      resource.attributeValues.url.value = `${getContentChannelUrl(
        resource.contentChannelId
      )}/${resource.attributeValues.url.value}`;
    }
  );

  return resources;
};

const getSeriesMessages = async (seriesGuid: string) => {
  let seriesMessages = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "MessageSeries",
      $filter: "ContentChannelId eq 63 and Status eq 'Approved'",
      value: `${seriesGuid}`,
      loadAttributes: "simple",
    },
  });

  if (!Array.isArray(seriesMessages)) {
    seriesMessages = [seriesMessages];
  }

  if (!seriesMessages) {
    return [];
  }

  return seriesMessages;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const seriesPath = params.path || "";

  const series = await getSeries(seriesPath);

  if (!series) {
    throw new Response("Series not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  // Modify the series.attributeValues.coverImage to be a full url -> using createImageUrlFromGuid
  series.attributeValues.coverImage = createImageUrlFromGuid(
    series.attributeValues.coverImage.value
  );

  const seriesMessageData = await getSeriesMessages(series.guid);

  return {
    series: series,
    messages: await Promise.all(seriesMessageData.map(mapRockDataToMessage)),
    resources: await getSeriesResources(series.guid),
  };
}
