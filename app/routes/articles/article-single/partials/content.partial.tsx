import { useLoaderData } from "react-router-dom";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { LoaderReturnType } from "../loader";

export const ArticleContent = ({ htmlContent }: { htmlContent: string }) => {
  const {
    callToActionSectionTitle,
    callToActionSectionSubtitle,
    callsToAction,
  } = useLoaderData<LoaderReturnType>();
  return (
    <div className="flex flex-col content-padding py-10 lg:pt-16">
      <div className="article-content flex w-full mx-auto max-w-5xl flex-col lg:max-w-screen-content">
        <HTMLRenderer
          html={htmlContent || ""}
          className="xl:text-lg font-regular"
        />

        {/* Call to action */}
        {callsToAction?.length > 0 && (
          <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between border-solid border-2 border-neutral-lighter bg-gray py-10 px-8 mt-10">
            <div className="flex flex-col gap-2.5">
              <h3 className="text-lg font-extrabold md:text-[28px] md:font-bold leading-snug my-0!">
                {callToActionSectionTitle}
              </h3>
              <p className="text-lg md:text-[22px] my-0!">
                {callToActionSectionSubtitle}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              {callsToAction?.length > 0 &&
                callsToAction?.map((cta, idx) => (
                  <Button
                    key={cta.url || idx}
                    className="mt-4 md:mt-0"
                    intent={
                      idx === callsToAction.length - 1 ? "primary" : "secondary"
                    }
                    href={cta.url}
                  >
                    {cta.title}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Bottom Divider */}
        <div
          className={`h-2 w-full bg-navy ${callsToAction ? "mt-10" : "mt-24"}`}
        />
      </div>
    </div>
  );
};
