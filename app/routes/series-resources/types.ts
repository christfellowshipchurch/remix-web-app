import type { ContentType } from '../page-builder/types';
import type { MessageType } from '../messages/types';

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

export type SeriesResource = {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  url: string;
  contentChannelId: string;
  contentType: ContentType;
};

export type SeriesEvent = {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  url: string;
  eventStartDate?: string;
};

export type LoaderReturnType = {
  series: Series;
  messages: MessageType[];
  events: SeriesEvent[];
  resources: SeriesResource[];
};
