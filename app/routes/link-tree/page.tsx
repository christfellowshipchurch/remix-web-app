import { useLoaderData } from "react-router-dom";
import { LinkTreeLoaderData } from "./types";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

const linkTreeButtonClass = cn(
  "w-full",
  "hover:enabled:bg-white",
  "hover:enabled:text-navy"
);

export function LinkTreePage() {
  const {
    title,
    content,
    summary,
    additionalResources,
    primaryCallToAction,
    // cardCollections,
  } = useLoaderData<LinkTreeLoaderData>();

  return (
    <div className=" bg-navy py-30 content-padding text-white text-center">
      <h1 className="heading-h1 my-16 ">{title}</h1>

      <div
        className={cn(
          "flex",
          "flex-col",
          "gap-6",
          "justify-center",
          "items-center",
          "max-w-[560px]",
          "w-full",
          "mx-auto",
          "font-light"
        )}
      >
        <h2 className="heading-h5 font-bold">{summary}</h2>
        <HTMLRenderer html={content} />
        <Button
          href={primaryCallToAction?.url}
          linkClassName="mt-10 w-full"
          className={linkTreeButtonClass}
        >
          {primaryCallToAction?.title}
        </Button>
        <h2 className="heading-h5 font-bold mt-4">Helpful Links</h2>
        <div className="flex flex-col gap-4 w-full">
          {additionalResources.map((resource) => (
            <Button
              href={resource.url}
              linkClassName="w-full"
              className={linkTreeButtonClass}
            >
              {resource.title}
            </Button>
          ))}
        </div>

        {/* todo: build out card collections */}
      </div>
    </div>
  );
}
