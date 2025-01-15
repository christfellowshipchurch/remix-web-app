import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";

export interface ArticleContentProps extends React.HTMLAttributes<HTMLElement> {
  htmlContent?: string;
  resources?: { resource: string; url: string }[];
}

const mockResources = [
  { resource: "Resource 1", url: "https://www.google.com" },
  { resource: "Resource 2", url: "https://www.google.com" },
  { resource: "Resource 3", url: "https://www.google.com" },
];

export const ArticleContent = ({
  htmlContent,
  resources = mockResources,
}: ArticleContentProps) => {
  return (
    <div className="article-content flex w-full mx-auto max-w-screen-lg flex-col px-6 py-10 md:px-10 lg:max-w-screen-md lg:px-6 lg:py-16">
      <h3 className="my-4 text-xl font-semibold">IN THIS ARTICLE</h3>
      <HTMLRenderer html={htmlContent || ""} />
      {/* Call to action */}
      <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between border-solid border-2 border-neutral-lighter bg-[#F3F5FA] py-10 px-8 mt-10">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">
            Call to action heading goes here
          </h3>
          <p className="text-slate-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <Button className="mt-4 md:mt-0" intent="primary" href="#testing">
          Learn more
        </Button>
      </div>
      {/* Bottom Divider */}
      <div className="h-2 w-full bg-navy mt-10" />
      {/* Resources */}
      <div className="text-xl font-semibold mt-10">Resources</div>
      <div className="flex flex-col border-l-2 border-ocean mt-3">
        {resources?.map(
          (data: { resource: string; url: string }, index: number) => (
            <a
              href={data?.url}
              key={index}
              className="mt-1 pl-5 text-ocean underline"
            >
              {data?.resource}
            </a>
          )
        )}
      </div>
    </div>
  );
};
