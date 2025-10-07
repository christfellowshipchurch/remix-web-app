export type SocialMedia = {
  type: string;
  url: string;
};

export type Author = {
  id: string;
  fullName: string;
  profilePhoto: string;
  authorAttributes: {
    bio: string;
    jobTitle: string;
    socialLinks: SocialMedia[];
    publications: {
      articles?: AuthorArticleProps[];
      books?: AuthorArticleProps[];
      podcasts?: AuthorArticleProps[];
    };
    pathname: string;
  };
};

export type AuthorBioProps = {
  author: Author;
  homeUrl?: string;
  variant?: "default" | "leaders";
  hideSocialLinks?: boolean;
};

export type AuthorArticleProps = {
  title: string;
  readTime: number;
  publishDate: string;
  coverImage: string;
  summary: string;
  url: string;
};

export type AuthorTabsProps = {
  articles?: AuthorArticleProps[];
  books?: AuthorArticleProps[];
  podcasts?: AuthorArticleProps[];
};
