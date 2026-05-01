import { leaders, type LeaderProfile } from '~/routes/about/components/leaders-data';
import { fetchAuthorByPathname } from '~/lib/.server/author-utils';

const fetchRockBio = async (pathname: string): Promise<string | null> => {
  try {
    const authorData = await fetchAuthorByPathname(pathname);
    const bio = authorData?.attributeValues?.authorBio?.value;
    return bio && bio.trim() ? bio : null;
  } catch {
    return null;
  }
};

export async function buildLeadersWithBios(): Promise<LeaderProfile[]> {
  const rockBios = await Promise.all(
    leaders.map((leader) => fetchRockBio(leader.pathname))
  );

  return leaders.map((leader, index) => ({
    ...leader,
    bio: rockBios[index] ?? leader.bio,
  }));
}

export function staticLeaders(): LeaderProfile[] {
  return leaders;
}
