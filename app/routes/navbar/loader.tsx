// This loader is used to fetch the feature cards for the navbar and is stored in the root loader to be used across the app

import type { LoaderFunctionArgs } from 'react-router-dom';
import { fetchRockData, TTL } from '~/lib/.server/fetch-rock-data';
// import { fetchTopSearches } from "~/lib/.server/fetch-top-searches";
import type { FeatureCard } from '~/components/navbar/types';
import { createImageUrlFromGuid } from '~/lib/utils';
import { getUserFromRequest } from '~/lib/.server/authentication/get-user-from-request';
import type { User } from '~/providers/auth-provider';
import { IconName } from '~/primitives/button/types';

export interface HeroAction {
  iconName: IconName;
  heading: string;
  title: string;
  url: string;
  position: number;
}

// Define the return type for the loader
export interface RootLoaderData {
  userData: User | null;
  actions: HeroAction[];
  ministries: {
    featureCards: FeatureCard[];
  };
  watchReadListen: {
    featureCards: FeatureCard[];
  };
  algolia: {
    ALGOLIA_APP_ID: string | undefined;
    ALGOLIA_SEARCH_API_KEY: string | undefined;
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
      title: 'Take the Journey',
      subtitle: 'New Classes',
      callToAction: {
        title: 'Sign Up Now',
        url: '/journey',
      },
      image: 'https://rock.christfellowship.church/GetImage.ashx?id=2966369',
      navMenu: 'get involved',
    };

    return [latestSermonData, latestArticleData, mockGetInvolvedData];
  } catch (error) {
    console.error('Error fetching feature cards:', error);
    return [];
  }
};

const fetchSiteBanner = async () => {
  const now = new Date();
  // Format date to ISO 8601 to remove milliseconds and timezone
  const formattedDate = now.toISOString().split('.')[0] + 'Z';

  try {
    const siteBanner = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: `ContentChannelId eq 100 and Status eq '2' and ExpireDateTime gt datetime'${formattedDate}'`,
        loadAttributes: 'simple',
      },
    });

    if (Array.isArray(siteBanner) && siteBanner.length > 0) {
      return siteBanner[0];
    } else {
      return siteBanner;
    }
  } catch (error) {
    console.error('Error fetching site banner:', error);
    return [];
  }
};

const sanitizeIconName = (raw: string | undefined): IconName | undefined => {
  if (raw == null || typeof raw !== 'string') return undefined;
  const cleaned = raw.replace(/\|/g, '').replace(/\s/g, '').trim();
  return cleaned.length > 0 ? (cleaned as IconName) : undefined;
};

interface HeroActionRaw {
  attributeValues?: { icon?: { value?: string }; url?: { value?: string } };
  description?: string;
  value?: string;
  order?: number;
}

const fetchHeroActions = async () => {
  const definedTypeId = 512;

  try {
    const heroActions = await fetchRockData({
      endpoint: 'DefinedValues',
      queryParams: {
        $filter: `DefinedTypeId eq ${definedTypeId} and IsActive eq true`,
        $orderby: 'Order desc',
        $top: '2',
        loadAttributes: 'simple',
      },
      ttl: TTL.LONG,
    });

    return heroActions.map((action: HeroActionRaw) => ({
      iconName: (sanitizeIconName(action.attributeValues?.icon?.value) ??
        'bell') as IconName,
      heading: action.description as string,
      title: action.value as string,
      url: action.attributeValues?.url?.value as string,
      position: action.order,
    }));
  } catch (error) {
    console.error('Error fetching hero actions:', error);
    return [];
  }
};

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<RootLoaderData> {
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

    const rawFeatureCards = await fetchFeatureCards();

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
        userData: null,
        actions: [],
        ministries: { featureCards: [] },
        watchReadListen: { featureCards: [] },
        algolia: {
          ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
          ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
        },
        popularResults: [],
        // Site Banner Data
        siteBanner: {
          content: '',
          link: '',
        },
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

    // Site Banner Data
    const rawSiteBanner = await fetchSiteBanner();
    const siteBannerContent =
      typeof rawSiteBanner?.content === 'string' ? rawSiteBanner.content : '';
    const callsToActionValue =
      rawSiteBanner?.attributeValues?.callsToAction?.value;
    const siteBannerLink =
      typeof callsToActionValue === 'string' && callsToActionValue.includes('^')
        ? (callsToActionValue.split('^').pop()?.trim() ?? '')
        : '';

    const siteBanner = {
      content: siteBannerContent,
      link: typeof siteBannerLink === 'string' ? siteBannerLink : '',
    };

    // TODO: uncomment this once we have the real data for the popular searches
    // const popularSearches = await fetchTopSearches(
    //   process.env.ALGOLIA_APP_ID,
    //   process.env.ALGOLIA_ANALYTICS_API_KEY ??
    //     process.env.ALGOLIA_SEARCH_API_KEY,
    //   12
    // );

    const actions = await fetchHeroActions();

    return {
      // Navbar Data
      userData: parsedUserData,
      actions: actions,
      ministries: {
        featureCards: ministryCards,
      },
      watchReadListen: {
        featureCards: mediaCards,
      },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
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
      actions: [],
      ministries: { featureCards: [] },
      watchReadListen: { featureCards: [] },
      algolia: {
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
      },
      popularResults: [],
      // Site Banner Data
      siteBanner: {
        content: '',
        link: '',
      },
    };
  }
}
