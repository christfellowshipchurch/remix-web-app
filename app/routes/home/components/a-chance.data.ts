export const chanceContent: {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
  buttonTitle: string;
  buttonLink: string;
  /** When true, `ImageScrollLayout` uses the root loader latest-message URL (same as Media nav cards). */
  buttonLinkFromLatestMessage?: boolean;
  aspectRatio?: string;
}[] = [
  {
    title: `<span className="font-bold">To focus</span> on what matters most`,
    image: '/assets/images/home/parallax-scroll-1.webp',
    imageWidth: 1216,
    imageHeight: 1058,
    description:
      'Every week, experience services designed to help you grow in your faith and equip you with practical wisdom for your everyday life.',
    buttonTitle: 'Find a Service',
    buttonLink: '/locations',
  },
  {
    title: `<span className="font-bold">To experience</span> real growth`,
    image: '/assets/images/home/parallax-scroll-2.webp',
    imageWidth: 1204,
    imageHeight: 806,
    description:
      "Church isn't just an hour on Sunday, it's a place to belong. Discover opportunities for the whole family to grow in their relationship with God and others.",
    buttonTitle: 'Find Your Place',
    buttonLink: '#something-for-everyone',
    aspectRatio: '600 / 400',
  },
  {
    title: `<span className="font-bold">To connect</span> with other people`,
    image: '/assets/images/home/parallax-scroll-3.webp',
    imageWidth: 1203,
    imageHeight: 1134,
    description:
      'Life is better together! Find genuine community, build meaningful relationships, and connect with people to do life with.',
    buttonTitle: 'Find Your People',
    buttonLink: '/group-finder',
  },
];
