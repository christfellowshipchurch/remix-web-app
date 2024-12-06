import { ArticleHeroProps } from "./partials/hero.partial";

export const mockAuthor = {
  fullName: "John Doe",
  photo: {
    uri: "https://picsum.photos/150",
  },
};

export const mockHeroData: ArticleHeroProps = {
  title: "Sample Article Title",
  author: mockAuthor,
  publishDate: "2023-10-01",
  coverImage: "https://picsum.photos/1080",
};

export const mockRelatedArticles = {
  tagId: "123",
  articles: [
    {
      title: "Understanding TypeScript",
      summary: "A comprehensive guide to TypeScript.",
      url: "/articles/understanding-typescript",
      coverImage: ["https://picsum.photos/200"],
      publishDate: "2023-01-01",
      author: mockAuthor,
      readTime: 5,
    },
    {
      title: "React Hooks in Depth",
      summary: "An in-depth look at React Hooks.",
      url: "/articles/react-hooks-in-depth",
      coverImage: ["https://picsum.photos/201"],
      publishDate: "2023-02-15",
      author: mockAuthor,
      readTime: 8,
    },
    {
      title: "Advanced JavaScript",
      summary: "Exploring advanced concepts in JavaScript.",
      url: "/articles/advanced-javascript",
      coverImage: ["https://picsum.photos/202"],
      publishDate: "2023-03-10",
      author: mockAuthor,
      readTime: 10,
    },
  ],
};
