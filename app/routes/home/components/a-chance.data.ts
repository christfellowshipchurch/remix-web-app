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
    title: 'To grow in every area of life',
    image: '/assets/images/home/parallax-scroll-2.webp',
    imageWidth: 1204,
    imageHeight: 806,
    description:
      'Church is more than just an hour on Sunday. Whether you’re exploring faith, raising a family, or looking to grow, there are opportunities all throughout the week to help you take your next step.',
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
      'Life is better together!  Find a community where you can grow in your relationship with God and others, and find people to walk through life with.',
    buttonTitle: 'Find Your People',
    buttonLink: '/group-finder',
  },
];
