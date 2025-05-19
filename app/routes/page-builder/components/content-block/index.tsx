import { FC } from "react";
import { ContentBlockData } from "../../types";
import { parseRockKeyValueList } from "~/lib/utils";

// Feature Layout
const FeatureSection: FC<{ data: ContentBlockData }> = ({ data }) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "");
  return (
    <section
      className={`flex flex-col md:flex-row items-center p-8 rounded-lg ${
        data.backgroundColor === "OCEAN"
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-900"
      }`}
      aria-label={data.name}
    >
      {data.coverImage && data.imageLayout === "LEFT" && (
        <img
          src={data.coverImage}
          alt={data.name}
          className={`w-full md:w-1/2 ${
            data.aspectRatio === "16by9"
              ? "aspect-video"
              : data.aspectRatio === "4by3"
              ? "aspect-[4/3]"
              : "aspect-square"
          } object-cover rounded-lg mb-4 md:mb-0 md:mr-8`}
        />
      )}
      <div className="flex-1">
        {data.subtitle && (
          <h4 className="text-sm font-semibold uppercase mb-2 tracking-widest">
            {data.subtitle}
          </h4>
        )}
        <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
        <p className="mb-6">{data.content}</p>
        <div className="flex flex-wrap gap-2">
          {ctas.map((cta, idx) => (
            <a
              key={idx}
              href={cta.url}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              {cta.title}
            </a>
          ))}
        </div>
      </div>
      {data.coverImage && data.imageLayout === "RIGHT" && (
        <img
          src={data.coverImage}
          alt={data.name}
          className="w-full md:w-1/2 aspect-video object-cover rounded-lg mb-4 md:mb-0 md:ml-8"
        />
      )}
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
