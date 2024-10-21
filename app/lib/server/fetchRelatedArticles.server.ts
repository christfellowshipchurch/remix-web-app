import Config from "./config/config.server";
import { flatten } from "lodash";
import { fetchRockData, getImages } from "./fetchRockData.server";
import { format } from "date-fns";
import { getAuthorDetails } from "~/routes/articles/loader";

const DEFAULT_TAG_ID = 1533; // "For You" - default tag id
const TOP_TAGGED_ITEMS_LIMIT = 20;

/**
 * Get related articles by ContentItem's GUID and tags
 **/
export async function getRelatedArticlesByContentItem(guid: string): Promise<{
  tag: string;
  tagId: string;
  articles: any[];
}> {
  try {
    const {
      ROCK_MAPPINGS: {
        // Related Articles we don't want to show
        RELATED_ARTICLES_EXCLUDE_TAGS,
        // Content Channel ID for Articles
        CONTENT_CHANNEL_PATHNAMES: { articles },
      },
    } = Config;

    // Find tags for the current article
    const taggedItems = await getTaggedItemsByEntityGuid(guid);
    const tagIds = await getValidTagIds(
      taggedItems,
      RELATED_ARTICLES_EXCLUDE_TAGS
    );

    // Determine the tag to use for related articles
    const relatedArticleTag = tagIds.length > 0 ? tagIds[0] : DEFAULT_TAG_ID;
    const relatedTaggedItems = await fetchRelatedTaggedItems({
      tagId: relatedArticleTag,
      entityId: guid,
    });

    // Fetch, filter, and sort the related articles
    const relatedContent = await fetchRelatedContent(relatedTaggedItems);
    const relatedArticles = relatedContent.filter(
      (contentItem) => contentItem?.contentChannelId === articles[0]
    );

    // Sort the related articles by priority and author
    relatedArticles.sort((a, b) => {
      if (a.priority === b.priority) {
        const authorA = a.attributeValues?.author?.value;
        const authorB = b.attributeValues?.author?.value;

        if (authorA && authorB) {
          return authorA.localeCompare(authorB);
        } else if (authorA) {
          return -1;
        } else if (authorB) {
          return 1;
        }
      }

      return b.priority - a.priority;
    });

    // Get the tag name for the related articles
    const tag = await fetchTag(relatedArticleTag);
    const firstThreeArticles = relatedArticles.slice(0, 3);

    // Format data for the related articles
    const formattedArticles = await Promise.all(
      firstThreeArticles.map(async (article) => {
        const { title, attributeValues, attributes, content, createdDateTime } =
          article;
        const { author, summary, url } = attributeValues;

        return {
          title,
          summary: summary?.value,
          url: url?.value,
          coverImage: getImages({ attributeValues, attributes }),
          publishDate: format(new Date(createdDateTime), "d MMM yyyy"),
          readTime: Math.round(content.split(" ").length / 200),
          author: await getAuthorDetails(author?.value),
        };
      })
    );

    return {
      tag: tag?.name,
      tagId: tag?.guid, // todo: add encryption
      articles: await Promise.all(formattedArticles),
    };
  } catch (error: any) {
    throw new Error("Error fetching related articles: " + error.message);
  }
}

const fetchTag = async (
  tagId: number
): Promise<{ name: string; guid: string }> => {
  const tags = await fetchRockData("Tags", {
    $filter: `Id eq ${tagId}`,
    $select: "Name, Guid",
  });
  return tags[0];
};

const getValidTagIds = async (
  taggedItems: any[],
  excludeTags: number[]
): Promise<number[]> => {
  return taggedItems
    .map((taggedItem) => taggedItem.tagId)
    .filter((tagId) => !excludeTags.includes(tagId));
};

const fetchRelatedTaggedItems = async ({
  tagId,
  entityId,
}: {
  tagId: number;
  entityId: string;
}): Promise<any[]> => {
  return await fetchRockData("TaggedItems", {
    $filter: `TagId eq ${tagId} and EntityGuid ne guid'${entityId}'`,
    $top: `${TOP_TAGGED_ITEMS_LIMIT}`,
  });
};

const fetchRelatedContent = async (taggedItems: any[]): Promise<any[]> => {
  return flatten(
    await Promise.all(
      taggedItems.map(async (taggedItem) => {
        return await getContentItemByGuid(taggedItem.entityGuid);
      })
    )
  );
};

const getTaggedItemsByEntityGuid = async (
  entityGuid: string
): Promise<any[]> => {
  const taggedItems = await fetchRockData("TaggedItems", {
    $filter: `EntityGuid eq guid'${entityGuid}'`,
  });

  return taggedItems;
};

const getContentItemByGuid = async (guid: string): Promise<any> => {
  return await fetchRockData("ContentChannelItems", {
    $filter: `Guid eq guid'${guid}'`,
    loadAttributes: "simple",
  });
};
