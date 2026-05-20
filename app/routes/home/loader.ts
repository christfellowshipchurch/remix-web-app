import type { LeaderProfile } from '~/routes/about/components/leaders-data';
import {
  buildLeadersWithBios,
  staticLeaders,
} from '~/lib/.server/build-leaders-with-bios';
import { fetchHeroActions } from './hero-actions.server';
import type { IconName } from '~/primitives/button/types';

export interface HeroAction {
  iconName: IconName;
  heading: string;
  title: string;
  url: string;
  position: number;
}

export type HomeLoaderData = {
  leaders: LeaderProfile[];
  actions: HeroAction[];
  ALGOLIA_APP_ID?: string;
  ALGOLIA_SEARCH_API_KEY?: string;
};

export const loader = async (): Promise<Response> => {
  let leaders: LeaderProfile[];
  let actions: HeroAction[];

  try {
    leaders = await buildLeadersWithBios();
  } catch {
    leaders = staticLeaders();
  }

  try {
    actions = await fetchHeroActions();
  } catch {
    actions = [];
  }

  return Response.json({
    leaders,
    actions,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  });
};
