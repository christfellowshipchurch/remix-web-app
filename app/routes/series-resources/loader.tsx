import { fetchRockData } from "~/lib/.server/fetch-rock-data";
import { Message } from "../messages/message-single/loader";

export type SeriesReturnType = {
  series: Series;
};

export type Series = {
  title: string;
  description: string;
  image: string;
  messages: Message[];
  resources: SeriesResource[];
  ctas: {
    title: string;
    url: string;
  }[];
};

export type SeriesResource = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export async function loader() {
  return {
    series: await getSeries(),
  };
}

// TODO: Update
const getSeries = async () => {
  const series = await fetchRockData({
    endpoint: "ContentChannelItems",
    queryParams: {
      $filter: "ContentChannelId eq 63",
    },
  });

  const mockSeries: Series = {
    title: "Just Jesus",
    description:
      "In this journey through the Gospel of Mark, we'll explore the stories and subjects that are often overlooked—seeing Jesus as both fully human and fully divine.",
    image: "/assets/images/series-resources/just-jesus.jpg",
    messages: [
      {
        title: "Who Was Jesus Really he lived?",
        summary: "Just Jesus | Week 1",
        coverImage: "/assets/images/series-resources/message-cover.jpg",
        startDateTime: "2025-03-09",
        attributeValues: {
          summary: { value: "Just Jesus | Week 1" },
          author: { value: "131225152", valueFormatted: "Todd Mullins" },
          url: { value: `/messages/who-was-jesus-really-he-lived` },
          actions: { value: "Actions" },
          topic: { value: "Topic" },
          resources: { value: "Resources" },
          series: { value: "Series" },
        },
        content: "Message 1 Content",
        hostUrl: "cf.church",
      },
      {
        title: "Who Was Jesus Really he lived?",
        summary: "Just Jesus | Week 1",
        coverImage: "/assets/images/series-resources/message-cover.jpg",
        startDateTime: "2025-03-09",
        attributeValues: {
          summary: { value: "Just Jesus | Week 1" },
          author: { value: "131225152", valueFormatted: "Todd Mullins" },
          url: { value: `/messages/who-was-jesus-really-he-lived` },
          actions: { value: "Actions" },
          topic: { value: "Topic" },
          resources: { value: "Resources" },
          series: { value: "Series" },
        },
        content: "Message 1 Content",
        hostUrl: "cf.church",
      },
      {
        title: "Who Was Jesus Really he lived?",
        summary: "Just Jesus | Week 1",
        coverImage: "/assets/images/series-resources/message-cover.jpg",
        startDateTime: "2025-03-09",
        attributeValues: {
          summary: { value: "Just Jesus | Week 1" },
          author: { value: "131225152", valueFormatted: "Todd Mullins" },
          url: { value: `/messages/who-was-jesus-really-he-lived` },
          actions: { value: "Actions" },
          topic: { value: "Topic" },
          resources: { value: "Resources" },
          series: { value: "Series" },
        },
        content: "Message 1 Content",
        hostUrl: "cf.church",
      },
      {
        title: "Who Was Jesus Really he lived?",
        summary: "Just Jesus | Week 1",
        coverImage: "/assets/images/series-resources/message-cover.jpg",
        startDateTime: "2025-03-09",
        attributeValues: {
          summary: { value: "Just Jesus | Week 1" },
          author: { value: "131225152", valueFormatted: "Todd Mullins" },
          url: { value: `/messages/who-was-jesus-really-he-lived` },
          actions: { value: "Actions" },
          topic: { value: "Topic" },
          resources: { value: "Resources" },
          series: { value: "Series" },
        },
        content: "Message 1 Content",
        hostUrl: "cf.church",
      },
      {
        title: "Who Was Jesus Really he lived?",
        summary: "Just Jesus | Week 1",
        coverImage: "/assets/images/series-resources/message-cover.jpg",
        startDateTime: "2025-03-09",
        attributeValues: {
          summary: { value: "Just Jesus | Week 1" },
          author: { value: "131225152", valueFormatted: "Todd Mullins" },
          url: { value: `/messages/who-was-jesus-really-he-lived` },
          actions: { value: "Actions" },
          topic: { value: "Topic" },
          resources: { value: "Resources" },
          series: { value: "Series" },
        },
        content: "Message 1 Content",
        hostUrl: "cf.church",
      },
    ],
    resources: [
      {
        title: "Resources title heading",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        image: "/assets/images/series-resources/resource-cover.jpg",
        url: "/resources/resource-1",
      },
      {
        title: "Resources title heading",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        image: "/assets/images/series-resources/resource-cover.jpg",
        url: "/resources/resource-2",
      },
      {
        title: "Resources title heading",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        image: "/assets/images/series-resources/resource-cover.jpg",
        url: "/resources/resource-3",
      },
      {
        title: "Resources title heading",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        image: "/assets/images/series-resources/resource-cover.jpg",
        url: "/resources/resource-4",
      },
      {
        title: "Resources title heading",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
        image: "/assets/images/series-resources/resource-cover.jpg",
        url: "/resources/resource-5",
      },
    ],

    ctas: [
      {
        title: "Times and Locations",
        url: "/locations",
      },
      {
        title: "App Devotional",
        url: "/search",
      },
    ],
  };
  return mockSeries;
};
