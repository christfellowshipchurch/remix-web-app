/**
 * todo : find a way to load iamges server side and have them cached so we're not loading on every page load
 */

import { useState } from "react";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";
import { ImageLoader } from "~/primitives/loading-states/image-loader.primitive";
import type { FeatureCard } from "../types";

interface NavCardBaseProps extends Partial<FeatureCard> {
  variant?: "mobile" | "desktop";
  title: string;
  subtitle: string;
  image: string;
  callToAction?: {
    title: string;
    url: string;
  };
}

export function HeroNavCard({
  title,
  subtitle,
  callToAction = { title: "Learn More", url: "#" },
  image,
  variant = "desktop",
}: NavCardBaseProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={callToAction?.url}
      className={cn(
        "bg-white p-4 rounded-lg shadow-medium hover:text-ocean transition-colors max-w-xxs",
        variant === "mobile" && "p-3"
      )}
    >
      {!loaded && <ImageLoader height={280} />}
      <img
        src={image}
        alt={title}
        className={`w-80 rounded-lg ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
      <h5 className="font-medium uppercase text-text-secondary text-xs mt-2">
        {subtitle}
      </h5>
      <h3 className="heading-h5 text-text-primary">{title}</h3>
      <div className="mt-3 font-semibold flex w-full justify-between">
        <span>{callToAction?.title}</span>
        <Icon name="arrowRight" />
      </div>
    </a>
  );
}

export function NavCard({
  title,
  subtitle,
  callToAction = { title: "Learn More", url: "#" },
  image,
}: NavCardBaseProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href={callToAction?.url}
      className="bg-white p-2 rounded-lg shadow-medium text-text-secondary  hover:text-ocean transition-colors w-full grid grid-cols-5 gap-4"
    >
      <div className="col-span-2 relative pb-9/16">
        {!loaded && <ImageLoader height={90} />}
        <img
          src={image}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover rounded-lg ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="col-span-3">
        <h5 className="font-medium text-text-secondary text-xs mt-2 uppercase">
          {subtitle}
        </h5>
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <div className="mt-3 font-semibold flex text-sm w-full justify-between">
          <span>{callToAction?.title}</span>
          <Icon name="arrowRight" />
        </div>
      </div>
    </a>
  );
}
