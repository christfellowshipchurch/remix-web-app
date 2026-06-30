// This loader is used to fetch the feature cards for the navbar and is stored in the root loader to be used across the app

import type { LoaderFunctionArgs } from 'react-router-dom';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
// import { fetchTopSearches } from "~/lib/.server/fetch-top-searches";
import type { FeatureCard } from '~/components/navbar/types';
import { createImageUrlFromGuid, parseRockKeyValueList } from '~/lib/utils';
import { getUserFromRequest } from '~/lib/.server/authentication/get-user-from-request';
import type { User } from '~/providers/auth-provider';
import { getServerAlgoliaIndexes } from '~/lib/.server/algolia-indexes.server';
import type { AlgoliaIndexMap } from '~/lib/algolia-indexes';
import { ContentChannelIds } from '~/lib/rock-config';
import type { RockContentChannelItem } from '~/lib/types/rock-types';

// Define the return type for the loader
export interface RootLoaderData {
  userData: User | null;
  ministries: {
    featureCards: FeatureCard[];
  };
  watchReadListen: {
    featureCards: FeatureCard[];
  };
  algolia: {
    ALGOLIA_APP_ID: string | undefined;
    ALGOLIA_SEARCH_API_KEY: string | undefined;
    indexes: AlgoliaIndexMap;
  };
  /** Popular results (content users click most). From Algolia getTopHits when available; else empty and UI uses hardcoded fallback. */
  popularResults: { title: string; pathname: string }[];
  siteBanner: {
    content: string;
    link?: string;
    ctas?: {
      title: string;
      url: string;
    }[];
  };
}

const EMPTY_SITE_BANNER = { content: '', link: '' };

export const mapSiteBannerFromRockItem = (
  rawSiteBanner: RockContentChannelItem | null | undefined,
) => {
  const siteBannerContent =
    typeof rawSiteBanner?.content === 'string' ? rawSiteBanner.content : '';
  const callsToActions = parseRockKeyValueList(
    rawSiteBanner?.attributeValues?.callsToAction?.value ?? '',
  );

  return {
    content: siteBannerContent,
    link: callsToActions[0]?.value ?? '',
  };
};

const fetchFeatureCards = async () => {
  try {
    const latestArticleData = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: `ContentChannelId eq 43 and Status eq 'Approved'`,
        $orderby: 'StartDateTime desc',
        $top: '1',
        loadAttributes: 'simple',
      },
    });

    const latestSermonData = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: `ContentChannelId eq 63 and Status eq 'Approved'`,
        $orderby: 'StartDateTime desc',
        $top: '1',
        loadAttributes: 'simple',
      },
    });

    // TODO: remove this once we have the real data for the get involved card(s)
    const mockGetInvolvedData = {
      title: 'New to our Church?',
      subtitle: 'Learn who we are, what we believe, and how to get connected.',
      callToAction: {
        title: 'Take the Journey Class',
        url: '/events/journey',
      },
      image: 'https://rock.christfellowship.church/GetImage.ashx?id=3190466',
      navMenu: 'get involved',
    };

    return [latestSermonData, latestArticleData, mockGetInvolvedData];
  } catch (error) {
    console.error('Error fetching feature cards:', error);
    return [];
  }
};

const fetchSiteBanner = async (): Promise<RockContentChannelItem | null> => {
  try {
    const siteBanner = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: `ContentChannelId eq ${ContentChannelIds.siteBanner}`,
        $orderby: 'StartDateTime desc',
        $top: '1',
        loadAttributes: 'simple',
      },
      filterByDateRange: true,
      filterByStatusApproved: true,
    });

    if (Array.isArray(siteBanner)) {
      return siteBanner[0] ?? null;
    }

    return siteBanner ?? null;
  } catch (error) {
    console.error('Error fetching site banner:', error);
    return null;
  }
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<RootLoaderData> {
  const algoliaIndexes = getServerAlgoliaIndexes();

  try {
    // Todo: fix user data for mobile/desktop nav menus. right now it's not returning the full user object, but is at least notifying is user is logged in or not. We will wait until the UI for the logged in experience is complete to fix this.
    const userData = await getUserFromRequest(request);

    // Handle the Response object
    let parsedUserData: User | null = null;
    if (userData instanceof Response) {
      const data = await userData.json();
      if (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'fullName' in data &&
        'email' in data &&
        'phoneNumber' in data &&
        'guid' in data &&
        'gender' in data &&
        'birthDate' in data &&
        'photo' in data
      ) {
        parsedUserData = data as User;
      }
    } else if (
      userData &&
      typeof userData === 'object' &&
      'id' in userData &&
      'fullName' in userData &&
      'email' in userData &&
      'phoneNumber' in userData &&
      'guid' in userData &&
      'gender' in userData &&
      'birthDate' in userData &&
      'photo' in userData
    ) {
      parsedUserData = userData as User;
    }

    const [rawFeatureCards, rawSiteBanner] = await Promise.all([
      fetchFeatureCards(),
      fetchSiteBanner(),
    ]);
    const siteBanner = mapSiteBannerFromRockItem(rawSiteBanner);

    // If the API call failed, return empty arrays
    if (
      !rawFeatureCards ||
      !Array.isArray(rawFeatureCards) ||
      rawFeatureCards.length === 0
    ) {
      // TODO: uncomment this once we have the real data for the popular searches
      // const popularSearches = await fetchTopSearches(
      //   process.env.ALGOLIA_APP_ID,
      //   process.env.ALGOLIA_ANALYTICS_API_KEY ??
      //     process.env.ALGOLIA_SEARCH_API_KEY,
      //   12,
      // );
      return {
        userData: parsedUserData,
        ministries: { featureCards: [] },
        watchReadListen: { featureCards: [] },
        algolia: {
          ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
          ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
          indexes: algoliaIndexes,
        },
        popularResults: [],
        siteBanner,
      };
    }

    // Transform the raw data into FeatureCard type
    const mappedFeatureCards: FeatureCard[] = rawFeatureCards.map((card) => {
      // Hardcoding the get involved card for now
      if (card.navMenu && card.navMenu.toLowerCase() === 'get involved') {
        return card;
      }

      const attributes = card.attributeValues;
      const isArticle = card.contentChannelId === 43;

      return {
        title: card.title || '',
        subtitle: isArticle ? 'New Article' : 'Latest Message',
        callToAction: {
          title: isArticle ? 'Read Now' : 'Watch Now',
          url: `/${isArticle ? 'articles' : 'messages'}/${
            attributes.url?.value
          }`,
        },
        image: createImageUrlFromGuid(attributes.image?.value || ''),
        navMenu: 'media',
      };
    });

    // Sort cards into their respective menus based on the navMenu attribute
    const ministryCards = mappedFeatureCards.filter(
      (card) => card.navMenu.toLowerCase() === 'get involved',
    );
    const mediaCards = mappedFeatureCards.filter(
      (card) => card.navMenu.toLowerCase() === 'media',
    );

    // TODO: uncomment this once we have the real data for the popular searches
    // const popularSearches = await fetchTopSearches(
    //   process.env.ALGOLIA_APP_ID,
    //   process.env.ALGOLIA_ANALYTICS_API_KEY ??
    //     process.env.ALGOLIA_SEARCH_API_KEY,
    //   12
    // );

    return {
      // Navbar Data
      userData: parsedUserData,
      ministries: {
        featureCards: ministryCards,
      },
      watchReadListen: {
        featureCards: mediaCards,
      },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
        indexes: algoliaIndexes,
      },
      popularResults: [],
      // Site Banner Data
      siteBanner: siteBanner,
    };
  } catch (error) {
    console.error('Error in navbar loader:', error);
    // Return empty arrays instead of throwing to prevent UI from breaking
    return {
      // Navbar Data
      userData: null,
      ministries: { featureCards: [] },
      watchReadListen: { featureCards: [] },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
        indexes: algoliaIndexes,
      },
      popularResults: [],
      siteBanner: EMPTY_SITE_BANNER,
    };
  }
}
