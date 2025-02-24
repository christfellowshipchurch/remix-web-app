// Types for the navbar component
export interface FeatureCard {
  title: string;
  subtitle: string;
  callToAction: {
    title: string;
    url: string;
  };
  image: string;
}

export interface MenuItem {
  title: string;
  description?: string;
  url: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
  link?: string;
}

export interface MenuLink {
  title: string;
  content: {
    mainContent: MenuSection[];
    featureCards: FeatureCard[];
  };
}
