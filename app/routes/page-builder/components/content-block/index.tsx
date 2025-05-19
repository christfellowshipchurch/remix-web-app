import { FC } from "react";
import { ContentBlockData } from "../../types";
import { cn, parseRockKeyValueList } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import lowerCase from "lodash/lowerCase";
import HTMLRenderer from "~/primitives/html-renderer";

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
  ``;
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
        <div className={`flex-1`}>
          <h2 className="text-text-primary heading-h2 mb-4">{data.name}</h2>
          {data.subtitle && (
            <h4
              className={`text-text-secondary font-medium uppercase mb-2 tracking-widest`}
            >
              {data.subtitle}
            </h4>
          )}
          <p className="mb-6 text-text-secondary">
            <HTMLRenderer html={data.content} />
          </p>
          <div className="flex flex-wrap gap-2">
            {ctas.map((cta, idx) => (
              <Button
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
  <section
    className={`flex items-center justify-center p-8 rounded-lg ${
      data.backgroundColor === "OCEAN"
        ? "bg-blue-900 text-white"
        : "bg-white text-gray-900"
    }`}
    aria-label={data.name}
  >
    {data.coverImage && (
      <img
        src={data.coverImage}
        alt={data.name}
        className="w-full max-w-3xl aspect-video object-cover rounded-lg"
      />
    )}
    <div className="absolute text-center">
      <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
      {data.subtitle && <h4 className="text-sm mb-2">{data.subtitle}</h4>}
      <p>{data.content}</p>
    </div>
  </section>
);

// CTA Cards Layout
const CtaCardsSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");
  return (
    <section
      className={`grid gap-4 p-8 rounded-lg ${
        data.backgroundColor === "OCEAN"
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-900"
      }`}
      aria-label={data.name}
    >
      <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
      {ctas.map((cta, idx) => (
        <div
          key={idx}
          className="flex flex-col md:flex-row items-center justify-between bg-blue-600/80 rounded p-4"
        >
          <span className="font-semibold mb-2 md:mb-0">{cta.title}</span>
          <a
            href={cta.url}
            className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition"
          >
            Go
          </a>
        </div>
      ))}
    </section>
  );
};

// CTA Fullscreen Layout
const CtaFullscreenSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");
  return (
    // className={cn(
    //   "content-padding py-16",
    //   !isLight && "text-white",
    //   `bg-${lowerCase(data.backgroundColor)}`
    // )}
    <section
      className={`flex flex-col items-center justify-center min-h-[300px] p-8 rounded-lg text-center ${
        data.backgroundColor === "OCEAN"
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-900"
      }`}
      aria-label={data.name}
    >
      <h2 className="text-3xl font-bold mb-4">{data.name}</h2>
      {data.subtitle && <h4 className="text-lg mb-2">{data.subtitle}</h4>}
      <p className="mb-6">{data.content}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {ctas.map((cta, idx) => (
          <a
            key={idx}
            href={cta.url}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg transition"
          >
            {cta.title}
          </a>
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
    case "CTA_CARDS":
      return <CtaCardsSection data={data} />;
    case "CTA_FULLSCREEN":
      return <CtaFullscreenSection data={data} />;
    default:
      return null;
  }
};
