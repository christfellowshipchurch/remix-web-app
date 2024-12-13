import HTMLRenderer from "~/primitives/html-renderer";

export interface ArticleContentProps extends React.HTMLAttributes<HTMLElement> {
  htmlContent?: string;
  resources?: [{ resource: string; url: string }];
}
export const ArticleContent = ({
  htmlContent,
  resources,
}: ArticleContentProps) => {
  return (
    <div className="article-content flex w-full max-w-screen-md flex-col px-6 py-10 md:px-10 lg:max-w-screen-md lg:px-6 lg:py-16">
      <h3 className="my-4">IN THIS ARTICLE</h3>
      <HTMLRenderer html={htmlContent || ""} />
      <div className="mb-3 mt-6 h-2 w-full bg-navy" />
      <div>Resources</div>
      <div className="border-l-2 border-ocean">
        {resources?.map(
          (data: { resource: string; url: string }, index: number) => (
            <a
              href={data?.url}
              key={index}
              className="mt-1 pl-2 text-text-primary"
            >
              {data?.resource}
            </a>
          )
        )}
      </div>
    </div>
  );
};
