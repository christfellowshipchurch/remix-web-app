import { PageBuilderSection } from "../ministry-builder/types";

export type RockLinkTreeData = {
  id: string;
  title: string;
  content: string;
  attributeValues: {
    summary: { value: string };
    additionalResources: { value: string };
    calltoAction: { value: string };
  };
};

export type LinkTreeLoaderData = {
  id: string;
  title: string;
  content: string;
  summary: string;
  additionalResources: Array<{ title: string; url: string }>;
  primaryCallToAction: { title: string; url: string } | undefined;
  resourceCollections: Array<
    PageBuilderSection & { type: "RESOURCE_COLLECTION" }
  >;
};
