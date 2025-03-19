import { LoaderFunctionArgs } from "react-router";
import { PodcastEpisode } from "../types";

export type LoaderReturnType = {
  episode: PodcastEpisode;
};

const mockPodcastEpisode: PodcastEpisode = {
  title: "Don’t Let Doubt Take You Out With Pastor Todd Mullins",
  description:
    "What does God’s Word say about your leadership potential? In these two episodes, Pastor and author Donna Pisani shares what God’s Word says about women in leadership and how you can confidently rise to your calling.",
  coverImage: "/assets/images/podcasts/hero.jpg",
  audio: "/assets/audio/podcasts/episode-1.mp3",
  show: "So Good Sisterhood",
  season: "11",
  episodeNumber: "4",
  authors: "Pastor Julie & Todd Mullins",
  shareLinks: [
    {
      title: "Apple Music",
      url: "https://www.google.com",
    },
    {
      title: "Spotify",
      url: "https://www.google.com",
    },
    {
      title: "Amazon Music",
      url: "https://www.google.com",
    },
  ],
  content:
    "<ul style='list-style-type: disc; padding-left: 1rem;'><li>How Jesus treated women as examples, not exceptions.</li> <li>Why working on your insecurities will help you avoid toxic leadership.</li><li>What the Bible really says about topics like submission and using your voice.</li><li>The three categories of context for Scriptures about women in the Bible.</li><li>Pastor Donna and Pastor Julie's moments of failing forward in leadership</li><li>The difference between being entrusted as a leader rather than entitled.</li></ul>",
  resources: [
    {
      title: "Download Discussion Guide",
      url: "https://www.google.com",
    },
    {
      title: "Resource",
      url: "https://www.google.com",
    },
    {
      title: "Keep Talking with a Group",
      url: "https://www.google.com",
    },
    {
      title: "10 Ways to be good with God",
      url: "https://www.google.com",
    },
    {
      title: "10 Ways to be good with God",
      url: "https://www.google.com",
    },
    {
      title: "Resource",
      url: "https://www.google.com",
    },
  ],
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episode } = params;

  if (!episode) {
    throw new Response("Episode not found", { status: 404 });
  }

  const podcastEpisode = await getPodcastEpisode(episode);

  return {
    episode: podcastEpisode,
  };
};

async function getPodcastEpisode(episode: string) {
  return mockPodcastEpisode;
}
