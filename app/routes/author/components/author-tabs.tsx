import * as Tabs from "@radix-ui/react-tabs";
import { AuthorArticle } from "./author-content";
import { AuthorTabsProps } from "../types";

const tabStyles =
  "border-ocean text-lg data-[state=active]:font-semibold px-5 py-3 data-[state=active]:border-b-2 data-[state=inactive]:text-neutral-500 mb-[-2px] hover:bg-neutral-100";

const tabContentStyles = "flex flex-col";

const AuthorTabs = ({ articles, books, podcasts }: AuthorTabsProps) => {
  return (
    <div className="h-full flex flex-col">
      <Tabs.Root defaultValue="articles" className="h-full flex flex-col">
        <Tabs.List className="border-b-2 border-neutral-300 flex-shrink-0 bg-white">
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

        <div className="flex-1 overflow-y-auto min-h-0">
          <Tabs.Content className={tabContentStyles} value="articles">
            {articles &&
              articles.map((article, index) => (
                <AuthorArticle key={index} {...article} />
              ))}
          </Tabs.Content>
          <Tabs.Content className={tabContentStyles} value="books">
            {books &&
              books.map((book, index) => (
                <AuthorArticle key={index} {...book} />
              ))}
          </Tabs.Content>
          <Tabs.Content className={tabContentStyles} value="podcasts">
            {podcasts &&
              podcasts.map((podcast, index) => (
                <AuthorArticle key={index} {...podcast} />
              ))}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default AuthorTabs;
