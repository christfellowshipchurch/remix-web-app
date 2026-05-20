import type { LeaderProfile } from './components/leaders-data';
import {
  buildLeadersWithBios,
  staticLeaders,
} from '~/lib/.server/build-leaders-with-bios';

export type AboutLoaderData = {
  leaders: LeaderProfile[];
};

export const loader = async (): Promise<Response> => {
  let leaders: LeaderProfile[];
  try {
    leaders = await buildLeadersWithBios();
  } catch {
    leaders = staticLeaders();
  }

  return Response.json({ leaders });
};
