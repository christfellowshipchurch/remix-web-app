import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { LoaderFunctionArgs } from "react-router-dom";
import { createImageUrlFromGuid, ensureArray } from "~/lib/utils";
import { MessageType } from "../messages/types";
import { getContentChannelUrl } from "~/lib/rock-config";
import { mapRockDataToMessage } from "../messages/message-single/loader";

export type LoaderReturnType = {
  series: Series;
  messages: MessageType[];
  events: {
    id: string;
    title: string;
    summary: string;
    coverImage: string;
    attributeValues: {
      summary: { value: string };
      image: { value: string };
      url: { value: string };
    };
    contentChannelId: string;
  }[];

  // A series resource will be anything tagged with the series defined value that is not a message or an event
  resources: {
    id: string;
    title: string;
    summary: string;
    coverImage: string;
    attributeValues: {
      summary: { value: string };
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

// ContentChannelId 63 is messages, 186 is events
const getSeriesResources = async (seriesGuid: string) => {
  const seriesResources = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "MessageSeries",
      $filter:
        "ContentChannelId ne 63 and ContentChannelId ne 186 and Status eq 'Approved'",
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
      attributeValues: {
        image: { value: string };
        summary: { value: string };
        url: { value: string };
      };
      contentChannelId: string;
      coverImage: string;
      summary: string;
    }) => {
      resource.summary = resource.attributeValues.summary?.value ?? "";
      resource.coverImage = createImageUrlFromGuid(
        resource.attributeValues.image.value
      );
      resource.attributeValues.url.value = `${getContentChannelUrl(
        parseInt(resource.contentChannelId)
      )}/${resource.attributeValues.url.value}`;
    }
  );

  return resources;
};

const getSeriesEvents = async (seriesGuid: string) => {
  const seriesEvents = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "MessageSeries",
      $filter: "ContentChannelId eq 186 and Status eq 'Approved'",
      value: `${seriesGuid}`,
      loadAttributes: "simple",
    },
  });

  const events = Array.isArray(seriesEvents) ? seriesEvents : [seriesEvents];

  events.forEach(
    (event: {
      attributeValues: {
        image: { value: string };
        summary: { value: string };
        url: { value: string };
      };
      contentChannelId: string;
      coverImage: string;
      summary: string;
    }) => {
      event.coverImage = createImageUrlFromGuid(
        event?.attributeValues?.image?.value
      );
      event.summary = event.attributeValues.summary.value;
    }
  );

  return events;
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

  const messages = await Promise.all(
    seriesMessageData.map(mapRockDataToMessage)
  );

  const resources = await getSeriesResources(series.guid);

  const events = await getSeriesEvents(series.guid);

  return {
    series: series,
    messages,
    resources,
    events,
  };
}
