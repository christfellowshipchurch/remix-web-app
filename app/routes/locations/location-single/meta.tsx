import type { MetaFunction } from 'react-router-dom';
import { createMeta } from '~/lib/meta-utils';
import { loader } from './loader';
import type { LoaderReturnType } from './loader';

function getLocationTitle(locationData: LoaderReturnType): string {
  const espanolCampusName = locationData.campusName
    ?.toLowerCase()
    .includes('iglesia')
    ? locationData.campusName.replace('Iglesia', '').trim()
    : locationData.campusName;

  // Match by URL slug — campusName from the loader is "Trinity" (no trailing space).
  if (locationData.campusUrl === 'trinity') {
    return 'Trinity at Christ Fellowship Church in Palm Beach Gardens, FL | Christ Fellowship Church';
  }
  if (
    locationData.campusName?.toLowerCase().includes('online') ||
    locationData.campusName?.toLowerCase().includes('everywhere')
  ) {
    return 'Christ Fellowship Church Online | Get the Most Out of Life';
  }
  if (locationData.campusName?.toLowerCase().includes('iglesia')) {
    return `Christ Fellowship Español en ${espanolCampusName}, FL | Christ Fellowship Church`;
  }
  return `Church in ${locationData.campusName},  Fl | Christ Fellowship Church`;
}

function getLocationDescription(locationData: LoaderReturnType): string {
  const espanolCampusName = locationData.campusName
    ?.toLowerCase()
    .includes('iglesia')
    ? locationData.campusName.replace('Iglesia', '').trim()
    : locationData.campusName;

  if (locationData.campusUrl === 'trinity') {
    return 'Join us at Trinity at Christ Fellowship Church in Palm Beach Gardens, FL for uplifting worship and community.';
  }
  if (
    locationData.campusName?.toLowerCase().includes('online') ||
    locationData.campusName?.toLowerCase().includes('everywhere')
  ) {
    return 'Experience Christ Fellowship Church online with worship, community, and resources to help you get the most out of life.';
  }
  if (locationData.campusName?.toLowerCase().includes('iglesia')) {
    return `Únete a Christ Fellowship Español en ${espanolCampusName}, FL.`;
  }
  return `Join us at Christ Fellowship Church in ${locationData.campusName?.trim()}, FL for uplifting worship and community.`;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locationData = data as LoaderReturnType | undefined;
  if (!locationData) {
    return [];
  }

  const keywords = `church in ${locationData.campusName} fl,  churches in ${locationData.campusName} fl, church in palm beach county, churches in palm beach county, christ fellowship church in ${locationData.campusName} fl, church near me, churches near me, church in my area, churches in my area, christian church near me, christian churches near me, non denominational church near me, non denominational churches near me, church service near me`;

  const campusImage = locationData.campusImage?.trim();

  return createMeta({
    title: getLocationTitle(locationData),
    description: getLocationDescription(locationData),
    keywords,
    path: `/locations/${locationData.campusUrl}`,
    image: campusImage || undefined,
  });
};
