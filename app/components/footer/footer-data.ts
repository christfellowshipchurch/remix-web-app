import { ROCK_PUBLIC_SITE_ORIGIN } from '~/lib/rock-config';

export interface FooterLink {
  title: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Resources',
    links: [
      { title: 'Church Online', url: '/locations/cf-everywhere' },
      { title: 'Past Messages', url: '/messages' },
      { title: 'Give Online', url: '/give' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { title: 'Connect Card', url: '#connect-card' },
      {
        title: 'Request Prayer',
        url: `${ROCK_PUBLIC_SITE_ORIGIN}/RequestPrayer`,
      },
      {
        title: 'Subscribe to Updates',
        url: `${ROCK_PUBLIC_SITE_ORIGIN}/page/4344`,
      },
      { title: 'Contact Us', url: '/contact-us' },
    ],
  },
  {
    title: 'About',
    links: [
      { title: 'Our Leadership', url: '/about#leadership' },
      { title: 'Career Opportunities', url: '/career-opportunities' },
      { title: 'Privacy Policy', url: '/privacy-policy' },
      { title: 'Terms of Use', url: '/terms-of-use' },
    ],
  },
  {
    title: 'More',
    links: [
      {
        title: 'CF Conference',
        url: 'https://www.christfellowshipconference.com/',
      },
      { title: 'Get Your Degree', url: 'https://www.cfseu.com/' },
      { title: 'Shop Online', url: 'https://cf-church.square.site/home' },
    ],
  },
];
