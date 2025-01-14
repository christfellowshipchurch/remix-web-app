import * as Tabs from "@radix-ui/react-tabs";
import { AuthorArticle, AuthorArticleProps } from "./author-content";

const tabStyles =
  "border-ocean text-lg data-[state=active]:font-semibold px-5 py-3 data-[state=active]:border-b-2 data-[state=inactive]:text-neutral-500 mb-[-2px] hover:bg-neutral-100";

const tabContentStyles = "flex flex-col";

export type AuthorTabsProps = {
  articles: AuthorArticleProps[];
  books?: AuthorArticleProps[];
  podcasts?: AuthorArticleProps[];
};

const AuthorTabs = ({ articles, books, podcasts }: AuthorTabsProps) => {
  return (
    <Tabs.Root defaultValue="articles">
      <Tabs.List className="border-b-2 border-neutral-300">
        {articles && articles?.length > 0 && (
          <Tabs.Trigger className={tabStyles} value="articles">
            Articles
          </Tabs.Trigger>
        )}
        {books && books.length > 0 && (
          <Tabs.Trigger className={tabStyles} value="books">
            Books
          </Tabs.Trigger>
        )}
        {podcasts && podcasts.length > 0 && (
          <Tabs.Trigger className={tabStyles} value="podcasts">
            Podcasts
          </Tabs.Trigger>
        )}
      </Tabs.List>
      <Tabs.Content className={tabContentStyles} value="articles">
        {articles &&
          articles.map((article, index) => (
            <AuthorArticle key={index} {...article} />
          ))}
      </Tabs.Content>
      <Tabs.Content className={tabContentStyles} value="books">
        {books &&
          books.map((book, index) => <AuthorArticle key={index} {...book} />)}
      </Tabs.Content>
      <Tabs.Content className={tabContentStyles} value="podcasts">
        {podcasts &&
          podcasts.map((podcast, index) => (
            <AuthorArticle key={index} {...podcast} />
          ))}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default AuthorTabs;
