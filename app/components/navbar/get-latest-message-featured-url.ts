import type { FeatureCard } from './types';

/** Matches the Media menu “Latest Message” feature card from the root loader (Rock). */
export function getLatestMessageFeaturedUrl(
  featureCards: FeatureCard[] | undefined,
): string | undefined {
  return featureCards?.find((card) => card.subtitle === 'Latest Message')
    ?.callToAction?.url;
}
