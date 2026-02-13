import type { LoaderFunction } from "react-router-dom";
import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import {
  createImageUrlFromGuid,
  ensureArray,
  parseRockKeyValueList,
} from "~/lib/utils";
import { MessageType } from "../types";
import { fetchWistiaDataFromRock } from "~/lib/.server/fetch-wistia-data";
import { attributeProps, attributeValuesProps } from "~/lib/types/rock-types";
import { RockContentChannelItem } from "~/lib/types/rock-types";
import { getImages } from "~/lib/.server/rock-utils";

export type LoaderReturnType = {
  message: MessageType;
  ALGOLIA_APP_ID: string | undefined;
  ALGOLIA_SEARCH_API_KEY: string | undefined;
};

export const mapRockDataToMessage = async (
  rockItem: RockContentChannelItem,
): Promise<MessageType> => {
  const { attributeValues, attributes, startDateTime, expireDateTime } =
    rockItem;

  const coverImage = getImages({
    attributeValues: attributeValues as attributeValuesProps,
    attributes: attributes as attributeProps,
  });

  const speaker = await fetchSpeakerData(
    rockItem.attributeValues?.author?.value || "",
  );

  let primaryCategories: { value: string }[] = [{ value: "" }];
  let secondaryCategories: { value: string }[] = [{ value: "" }];

  if (rockItem.attributeValues.primaryCategory?.value) {
    // Separate the primary category into an array of values
    const categoryValues =
      rockItem.attributeValues.primaryCategory?.value.split(",");

    // Loop through all category values and fetch their details
    const sermonPrimaryCategories: { value: string }[] = [];
    for (const categoryGuid of categoryValues) {
      const sermonPrimaryCategory = await fetchRockData({
        endpoint: `DefinedValues/`,
        queryParams: {
          $filter: `Guid eq guid'${categoryGuid.trim()}'`,
          $select: "Value",
        },
      });

      if (sermonPrimaryCategory && sermonPrimaryCategory.length > 0) {
        sermonPrimaryCategories.push(sermonPrimaryCategory[0]);
      } else {
        sermonPrimaryCategories.push(sermonPrimaryCategory);
      }
    }

    primaryCategories = sermonPrimaryCategories;
  }

  if (rockItem.attributeValues.secondaryCategory?.value) {
    const categoryValues =
      rockItem.attributeValues.secondaryCategory?.value.split(",");

    const sermonSecondaryCategories: { value: string }[] = [];
    for (const categoryGuid of categoryValues) {
      const sermonSecondaryCategory = await fetchRockData({
        endpoint: `DefinedValues/`,
        queryParams: {
          $filter: `Guid eq guid'${categoryGuid.trim()}'`,
          $select: "Value",
        },
      });

      if (sermonSecondaryCategory && sermonSecondaryCategory.length > 0) {
        sermonSecondaryCategories.push(sermonSecondaryCategory[0]);
      } else {
        sermonSecondaryCategories.push(sermonSecondaryCategory);
      }
    }

    secondaryCategories = sermonSecondaryCategories;
  }

  let video = "";
  const mediaValue = attributeValues?.media?.value;
  if (mediaValue?.trim()) {
    try {
      const wistiaData = await fetchWistiaDataFromRock(mediaValue);
      video = wistiaData?.sourceKey || "";
    } catch (error) {
      console.error("Error fetching Wistia data for message:", error);
    }
  }

  return {
    id: rockItem.id,
    title: rockItem.title,
    content: rockItem.content || "",
    summary: attributeValues?.summary?.value || "",
    image: createImageUrlFromGuid(attributeValues?.image?.value || "") || "",
    video,
    coverImage: (coverImage && coverImage[0]) || "",
    primaryCategories,
    secondaryCategories,
    startDateTime: startDateTime || "",
    expireDateTime: expireDateTime || "",
    seriesId: rockItem.attributeValues?.messageSeries?.value || "",
    seriesTitle: rockItem.attributeValues?.messageSeries?.valueFormatted || "",
    speaker,
    url: rockItem.attributeValues?.url?.value || "",
    additionalResources: parseRockKeyValueList(
      rockItem.attributeValues?.callsToAction?.value || "",
    ).map((resource) => ({
      title: resource.key,
      url: resource.value,
    })),
  };
};

const fetchMessageByPath = async (path: string) => {
  const rockData = await fetchRockData({
    endpoint: "ContentChannelItems/GetByAttributeValue",
    queryParams: {
      attributeKey: "Url",
      $filter: "Status eq 'Approved' and ContentChannelId eq 63",
      value: path,
      loadAttributes: "simple",
    },
  });

  const messages = ensureArray(rockData);

  if (messages.length === 0) {
    return null;
  }

  if (messages.length > 1) {
    console.error(
      `More than one message was found with the same path: /messages/${path}`,
    );
  }

  return messages[0];
};

// TODO: Centralize this function to work with articles, messages, series, authors, etc.
const fetchSpeakerData = async (guid: string) => {
  let authorAlias = null;

  try {
    authorAlias = await fetchRockData({
      endpoint: "PersonAlias",
      queryParams: {
        $filter: `Guid eq guid'${guid}'`,
        $select: "PersonId",
      },
    });
    authorAlias = ensureArray(authorAlias);
  } catch (error) {
    console.error("Error fetching author id", error);
  }

  if (authorAlias && authorAlias.length > 0) {
    let author = null;
    try {
      author = await fetchRockData({
        endpoint: "People",
        queryParams: {
          $filter: `Id eq ${authorAlias[0].personId}`,
          $expand: "Photo",
        },
      });

      author = ensureArray(author);

      if (author && author.length > 0) {
        return {
          fullName: author[0].firstName + " " + author[0].lastName,
          profilePhoto: author[0].photo.path,
          guid: author[0].guid,
        };
      }
    } catch (error) {
      console.error("Error fetching author data", error);
    }

    return author;
  }

  return null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderReturnType> => {
  const path = params?.path || "";

  const messageData = await fetchMessageByPath(path);

  if (!messageData) {
    throw new Response(`Message not found at: /messages/${path}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const message = await mapRockDataToMessage(messageData);

  return {
    message,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  };
};
