import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { LoaderFunctionArgs } from "react-router-dom";
import lodash from "lodash";
import { createImageUrlFromGuid } from "~/lib/utils";
import { Message } from "../messages/message-single/loader";
import { ContentChannelIds, getContentChannelUrl } from "~/lib/rock-config";
export type SeriesReturnType = {
  series: Series;
  messages: Message[];
  // A series resource will be anything tagged with the series defined value that is not a message
  resources: any[];
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

export async function loader({ params }: LoaderFunctionArgs) {
  const seriesPath = params.path;

  if (!seriesPath) {
    return {
      series: null,
    };
  }

  const series = await getSeries(seriesPath);

  if (!series) {
    return Error("Series not found");
  }

  // Modify the series.attributeValues.coverImage to be a full url -> using createImageUrlFromGuid
  series.attributeValues.coverImage = createImageUrlFromGuid(
    series.attributeValues.coverImage.value
  );

  return {
    series: series,
    messages: await getSeriesMessages(series.guid),
    resources: await getSeriesResources(series.guid),
  };
}

const getSeries = async (seriesPath: string) => {
  const seriesDefinedValues = await fetchRockData({
    endpoint: "DefinedValues",
    queryParams: {
      $filter: "DefinedTypeId eq 590",
      loadAttributes: "simple",
    },
  });

  if (!seriesDefinedValues) {
    return null;
  }

  const series = seriesDefinedValues.find(
    (item: any) => lodash.kebabCase(item.value) === seriesPath
  );

  return series;
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

  resources.forEach((resource: any) => {
    resource.coverImage = createImageUrlFromGuid(
      resource.attributeValues.image.value
    );
  });

  resources.forEach((resource: any) => {
    resource.attributeValues.url.value = `${getContentChannelUrl(
      resource.contentChannelId
    )}/${resource.attributeValues.url.value}`;
  });

  return resources;
};

const getSeriesMessages = async (seriesGuid: string) => {
  const seriesMessages = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "MessageSeries",
      $filter: "ContentChannelId eq 63 and Status eq 'Approved'",
      value: `${seriesGuid}`,
      loadAttributes: "simple",
    },
  });

  // Map through messages and fix the coverImage to be a full url -> using createImageUrlFromGuid
  seriesMessages.forEach((message: Message) => {
    message.coverImage = createImageUrlFromGuid(
      message.attributeValues.image.value
    );
  });

  seriesMessages.forEach((message: Message) => {
    message.attributeValues.url.value = `/messages/${message.attributeValues.url.value}`;
  });

  if (!seriesMessages) {
    return [];
  }

  return seriesMessages;
};
