import { FC } from "react";
import { cn, parseRockKeyValueList } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";
import { ContentBlockData } from "../../types";

export const FeatureImage: FC<{ data: ContentBlockData }> = ({ data }) => {
  return (
    <div
      className={cn("w-full mb-4 md:mb-0 md:ml-8", {
        "lg:w-1/4 md:w-1/3": data.aspectRatio === "4by5",
        "md:w-1/3": data.aspectRatio === "1by1",
        "lg:w-1/2 md:w-1/3": data.aspectRatio === "16by9",
      })}
    >
      <img
        src={data.coverImage}
        alt={data.name}
        className={cn(
          "object-cover rounded-lg max-h-none sm:max-h-[500px] mr-auto md:mx-auto",
          {
            "aspect-[16/9]": data.aspectRatio === "16by9",
            "aspect-[4/5]": data.aspectRatio === "4by5",
            "aspect-[1/1]": data.aspectRatio === "1by1",
          }
        )}
      />
    </div>
  );
};

// Feature Layout
export const FeatureSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");

  return (
    <section className={cn("content-padding py-16")} aria-label={data.name}>
      <div
        className={cn(
          "flex flex-col md:flex-row gap-12 xl:gap-20 items-center max-w-screen-content mx-auto",
          {
            "flex-col-reverse": data.imageLayout === "RIGHT",
          }
        )}
      >
        {data.coverImage && data.imageLayout === "LEFT" && (
          <FeatureImage data={data} />
        )}
        <div className={`flex-1 flex flex-col gap-5`}>
          <h2 className="text-text-primary heading-h4 md:heading-h2 leading-snug">
            {data.name}
          </h2>
          {data.subtitle && (
            <h4
              className={`text-text-secondary text-lg font-bold uppercase mb-2 tracking-widest hidden md:block`}
            >
              {data.subtitle}
            </h4>
          )}
          <HTMLRenderer
            className="text-text-secondary text-lg"
            html={data.content}
          />
          <div className="flex items-center sm:items-start flex-col-reverse md:flex-row flex-wrap gap-4 mt-10">
            {ctas.slice(0, 2).map((cta, idx) => (
              <Button
                linkClassName="w-full px-6 sm:w-auto sm:px-0"
                className="font-normal w-full"
                intent={idx === 0 ? "white" : "primary"}
                key={idx}
                href={cta.url}
              >
                {cta.title}
              </Button>
            ))}
          </div>
        </div>
        {data.coverImage && data.imageLayout === "RIGHT" && (
          <FeatureImage data={data} />
        )}
      </div>
    </section>
  );
};
