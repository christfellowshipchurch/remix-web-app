import { FC } from "react";
import { ContentBlockData } from "../../types";
import { cn, parseRockKeyValueList } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import lowerCase from "lodash/lowerCase";
import HTMLRenderer from "~/primitives/html-renderer";
import { getCtaStyles } from "../builder-utils";

const FeatureImage: FC<{ data: ContentBlockData }> = ({ data }) => {
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
const FeatureSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");

  return (
    <section className={cn("content-padding py-16")} aria-label={data.name}>
      <div
        className={cn(
          "flex flex-col md:flex-row gap-10 xl:gap-20 items-center max-w-screen-content mx-auto",
          {
            "flex-col-reverse": data.imageLayout === "RIGHT",
          }
        )}
      >
        {data.coverImage && data.imageLayout === "LEFT" && (
          <FeatureImage data={data} />
        )}
        <div className={`flex-1 flex flex-col gap-4`}>
          <h2 className="text-text-primary heading-h2 mb-4">{data.name}</h2>
          {data.subtitle && (
            <h4
              className={`text-text-secondary text-lg font-bold uppercase mb-2 tracking-widest`}
            >
              {data.subtitle}
            </h4>
          )}
          <HTMLRenderer
            className="text-text-secondary text-lg"
            html={data.content}
          />
          <div className="flex flex-wrap gap-2 mt-10">
            {ctas.slice(0, 2).map((cta, idx) => (
              <Button
                className="font-normal"
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

// Banner Layout
const BannerSection: FC<{ data: ContentBlockData }> = ({ data }) => (
  <section aria-label={data.name}>
    {data.coverImage && (
      <img
        src={data.coverImage}
        alt={data.name}
        className="w-full aspect-square sm:aspect-video lg:aspect-[16/7] xl:aspect-[16/6] object-cover"
      />
    )}
  </section>
);

// CTA Card Layout
const CtaCardSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");
  const { isDark, getButtonIntent, getButtonClassName } = getCtaStyles(data, 2);

  return (
    <section className="content-padding py-28" aria-label={data.name}>
      <div
        className={cn(
          "flex flex-col md:flex-row gap-10",
          "md:items-center justify-between",
          "border border-neutral-lighter rounded-2xl p-8 md:p-12",
          `bg-${lowerCase(data.backgroundColor)}`
        )}
      >
        <div className="flex-1 lg:max-w-[50%]">
          <h2
            className={cn("heading-h3 mb-4", {
              "text-white": isDark,
            })}
          >
            {data.name}
          </h2>
          <HTMLRenderer
            className={isDark ? "text-text-alternate" : "text-text-secondary"}
            html={data.content}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          {/* Limit to 2 CTA buttons */}
          {ctas.slice(0, 2).map((cta, idx) => (
            <Button
              key={cta.url}
              className={cn(getButtonClassName(idx), "font-normal")}
              intent={getButtonIntent(idx)}
              href={cta.url}
            >
              {cta.title}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Fullscreen Layout
const CtaFullscreenSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");
  const { isDark, getButtonIntent, getButtonClassName } = getCtaStyles(data, 3);

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center text-center gap-8 py-16 m-h-[452px]",
        `bg-${lowerCase(data.backgroundColor)}`,
        {
          "text-white": isDark,
          "text-gray-900": !isDark,
        }
      )}
      aria-label={data.name}
    >
      <h2 className="heading-h2">{data.name}</h2>
      <HTMLRenderer
        className={cn("max-w-3xl text-pretty", {
          "text-text-alternate": isDark,
          "text-text-secondary": !isDark,
        })}
        html={data.content}
      />
      <div className="flex flex-wrap gap-4 justify-center">
        {ctas.slice(0, 3).map((cta, idx) => (
          <Button
            key={cta.url}
            className={cn(getButtonClassName(idx), "font-normal")}
            intent={getButtonIntent(idx)}
            href={cta.url}
          >
            {cta.title}
          </Button>
        ))}
      </div>
    </section>
  );
};

// Main ContentBlock Component
export const ContentBlock: FC<{ data: ContentBlockData }> = ({ data }) => {
  switch (data.layoutType) {
    case "FEATURE":
      return <FeatureSection data={data} />;
    case "BANNER":
      return <BannerSection data={data} />;
    case "CARD":
      return <CtaCardSection data={data} />;
    case "FULLSCREEN":
      return <CtaFullscreenSection data={data} />;
    default:
      return null;
  }
};
