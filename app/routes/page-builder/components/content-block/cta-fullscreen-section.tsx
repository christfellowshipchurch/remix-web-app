import { FC } from "react";
import lowerCase from "lodash/lowerCase";

import { cn, parseRockKeyValueList } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";

import { ContentBlockData } from "../../types";
import { getCtaStyles } from "../builder-utils";

// CTA Fullscreen Layout
export const CtaFullscreenSection: FC<{ data: ContentBlockData }> = ({
  data,
}) => {
  const ctas = parseRockKeyValueList(data.callsToAction ?? "").map((cta) => ({
    title: cta.key,
    url: cta.value,
  }));
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
