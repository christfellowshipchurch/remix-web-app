import { LoaderFunction } from 'react-router-dom';
import { fetchRockData } from '~/lib/.server/fetch-rock-data';
import { RockContentChannelItem } from '~/lib/types/rock-types';
import { createImageUrlFromGuid, getImageUrl } from '~/lib/utils';

export type Ministry = {
  title: string;
  description: string;
  image: string;
  url: string;
};

/**
 * Hide Spanish / Español ministry cards from the `/ministries` index grid.
 *
 * The Español ministry page still lives at `/ministries/espanol` (ministry
 * builder + Rock Pathname `espanol`). It should not appear as a card on the
 * main ministries listing, which is English-facing. Match both "Español" and
 * ASCII "espanol" / "Espanol" because Rock titles may use either form.
 */
const isEspanolMinistryTitle = (title: string): boolean => {
  const lower = title.toLowerCase();
  return title.includes('Español') || lower.includes('espanol');
};

const mapMinistryChannelItems = async (
  ministriesData: RockContentChannelItem[],
): Promise<Ministry[]> => {
  return ministriesData.map((ministry: RockContentChannelItem): Ministry => {
    return {
      title: ministry.title,
      description: ministry.attributeValues?.summary?.value || '',
      image: ministry.attributeValues?.image?.value
        ? createImageUrlFromGuid(ministry.attributeValues?.image?.value)
        : '',
      url: ministry.attributeValues?.pathname?.value || '',
    };
  });
};

const hardCodedMinistries: Ministry[] = [
  {
    title: 'Internships',
    description:
      'Gain hands-on ministry experience, intentional mentorship, and leadership development.',
    image: getImageUrl('3141722'),
    url: '/internships',
  },
  {
    title: 'CFSEU',
    description:
      'Earn your degree through Southeastern University at Christ Fellowship.',
    image: getImageUrl('2966341'),
    url: 'https://www.cfseu.com',
  },
];

export const loader: LoaderFunction = async (): Promise<{
  ministries: Ministry[];
}> => {
  try {
    const ministriesData = await fetchRockData({
      endpoint: 'ContentChannelItems',
      queryParams: {
        $filter: "ContentChannelId eq 171 and Status eq '2'", // Approved Ministries Content Channel Items
        $orderby: 'Order',
        loadAttributes: 'simple',
      },
    });

    if (!ministriesData) {
      throw new Response('Ministries page not found', {
        status: 404,
        statusText: 'Not Found',
      });
    }

    //ensure the ministries data is an array
    let ministriesArray = [];
    if (!Array.isArray(ministriesData)) {
      ministriesArray = [ministriesData];
    } else {
      ministriesArray = ministriesData;
    }

    // Drop Español from the index after mapping (+ hard-coded cards); page stays reachable by URL.
    const ministries = [
      ...(await mapMinistryChannelItems(ministriesArray)),
      ...hardCodedMinistries,
    ].filter((ministry) => !isEspanolMinistryTitle(ministry.title));

    return { ministries };
  } catch (error) {
    console.error('Error in ministries loader:', error);
    throw new Response('Failed to load ministries content', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
};
