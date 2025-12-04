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
    title: "Resources",
    links: [
      { title: "Church Online", url: "/locations/cf-everywhere" },
      {
        title: "Past Messages",
        url: "https://www.youtube.com/playlist?list=PLUQ7jSnRB_efXMDq9Lka6stS02awWoaz4",
      },
      { title: "Give Online", url: "/give" },
    ],
  },
  {
    title: "Connect",
    links: [
      { title: "Connect Card", url: "#connect-card" },
      { title: "Request Prayer", url: "https://rock.gocf.org/RequestPrayer" },
      {
        title: "Subscribe to Updates",
        url: "https://church.us11.list-manage.com/subscribe?u=76848e191018191e2e2d01d77&id=3265404466",
      },
      { title: "Contact Us", url: "mailto:hello@christfellowship.church" },
    ],
  },
  {
    title: "About",
    links: [
      { title: "Our Leadership", url: "/about" },
      { title: "Career Opportunities", url: "/career-opportunities" },
      { title: "Privacy Policy", url: "/privacy-policy" },
      { title: "Terms of Use", url: "/terms-of-use" },
    ],
  },
  {
    title: "More",
    links: [
      {
        title: "CF Conference",
        url: "https://www.christfellowshipconference.com/",
      },
      { title: "Get Your Degree", url: "https://www.cfseu.com/" },
      { title: "Shop Online", url: "https://cf-church.square.site/home" },
    ],
  },
];
