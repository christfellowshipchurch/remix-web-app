import { FC } from "react";
import { cn, parseRockKeyValueList } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { ContentBlockData } from "../../types";

export const FeatureImage: FC<{ data: ContentBlockData }> = ({ data }) => {
  return (
    <div
      className={cn("w-full mb-4 md:mb-0", {
        "lg:w-1/4 md:w-1/3": data.aspectRatio === "4by5",
        "md:w-1/3": data.aspectRatio === "1by1",
        "lg:w-1/2 md:w-1/3": data.aspectRatio === "16by9",
      })}
    >
      {data.featureVideo ? (
        <div
          className={cn("rounded-lg overflow-hidden aspect-[1/1]", {
            "md:aspect-[16/9]": data.aspectRatio === "16by9",
            "md:aspect-[4/5]": data.aspectRatio === "4by5",
            "md:aspect-[1/1]": data.aspectRatio === "1by1",
          })}
        >
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${data.featureVideo}?fitStrategy=cover`}
            title={data.name}
            className="w-full h-full"
          />
        </div>
      ) : (
        <img
          src={data.coverImage}
          alt={data.name}
          className={cn(
            "object-cover rounded-lg max-h-none sm:max-h-[500px] mr-auto md:mx-auto aspect-[1/1]",
            {
              "md:aspect-[16/9]": data.aspectRatio === "16by9",
              "md:aspect-[4/5]": data.aspectRatio === "4by5",
              "md:aspect-[1/1]": data.aspectRatio === "1by1",
            }
          )}
        />
      )}
    </div>
  );
};

// Feature Layout
export const FeatureSection: FC<{
  data: ContentBlockData;
  customCtas?: {
    title: string;
    url: string;
  }[];
}> = ({ data, customCtas }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "").map((cta) => ({
    title: cta.key,
    url: cta.value,
  }));
  const slicedCtas = ctas.slice(0, 2);
  const grayBg = data.backgroundColor === "GRAY" || null;

  return (
    <section
      className={cn(
        "content-padding py-12 lg:py-16",
        grayBg ? "bg-gray" : "bg-transparent"
      )}
      aria-label={data.name}
    >
      <div
        className={cn(
          "flex flex-col md:flex-row gap-12 xl:gap-20 items-center max-w-screen-content mx-auto",
          {
            "flex-col-reverse": data.imageLayout === "RIGHT",
          }
        )}
      >
        {(data.coverImage || data.featureVideo) &&
          data.imageLayout === "LEFT" && <FeatureImage data={data} />}
        <div className={`flex-1 flex flex-col gap-5`}>
          <h2 className="text-text-primary heading-h4 md:heading-h2">
            {data.name}
          </h2>
          {data.subtitle && (
            <h4
              className={`text-text-secondary text-lg font-bold uppercase mb-2 tracking-widest -mt-2 md:mt-0`}
            >
              {data.subtitle}
            </h4>
          )}
          <HTMLRenderer
            className="content-block lg:text-lg"
            html={data.content}
          />
          <div className="flex items-center sm:items-start flex-col-reverse md:flex-row flex-wrap gap-4 mt-10">
            {slicedCtas.map((cta, idx) => (
              <Button
                linkClassName="w-full px-6 sm:w-auto sm:px-0"
                className="font-normal w-full rounded-lg"
                intent={
                  slicedCtas.length > 1 && idx === 0 ? "white" : "primary"
                }
                key={idx}
                href={cta.url}
              >
                {cta.title}
              </Button>
            ))}
            {customCtas?.map((cta, idx) => (
              <Button
                linkClassName="w-full px-6 sm:w-auto sm:px-0"
                className="font-normal w-full rounded-lg"
                intent={"secondary"}
                key={idx}
                href={cta.url}
                size="md"
              >
                {cta.title}
              </Button>
            ))}
          </div>
        </div>
        {(data.coverImage || data.featureVideo) &&
          data.imageLayout === "RIGHT" && <FeatureImage data={data} />}
      </div>
    </section>
  );
};
