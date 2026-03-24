export const chanceContent: {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
  url: string;
  aspectRatio?: string;
}[] = [
  {
    title: `<span className="font-bold">To connect</span> with other people`,
    image: "/assets/images/home/parallax-scroll-1.webp",
    imageWidth: 1216,
    imageHeight: 1058,
    description:
      " Looking for community? A place where you can find genuine connection with other people. A place where you're not just a face in the crowd, but someone who belongs. ",
    url: "/connect",
  },
  {
    title: `<span className="font-bold">To hit pause</span> on the chaos of everyday life`,
    image: "/assets/images/home/parallax-scroll-2.webp",
    imageWidth: 1204,
    imageHeight: 806,
    description:
      "Searching for some kind of peace or purpose? Life can throw some curveballs, and sometimes you need a place to reflect, recharge, and find some perspective. ",
    url: "/connect",
    aspectRatio: "600 / 400",
  },
  {
    title: `<span className="font-bold">To hear a story,</span> to sing a song, to be reminded of hope.`,
    image: "/assets/images/home/parallax-scroll-3.webp",
    imageWidth: 1203,
    imageHeight: 1134,
    description:
      "Sing some songs, hear a good story, and be reminded that there is still good in the world. ",
    url: "/connect",
  },
];
