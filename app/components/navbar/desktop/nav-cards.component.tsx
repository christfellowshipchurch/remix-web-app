/**
 * todo : find a way to load iamges server side and have them cached so we're not loading on every page load
 */

import { useState } from "react";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";
import { ImageLoader } from "~/primitives/loading-states/image-loader.primitive";

export interface NavCardProps {
  title: string;
  subtitle: string;
  url: string;
  coverImage: string;
  linkText: string;
  variant?: "mobile" | "desktop";
}

export function HeroNavCard({
  title,
  subtitle,
  url,
  coverImage,
  linkText,
  variant = "desktop",
}: NavCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={url}
      className={cn(
        "bg-white p-4 rounded-lg shadow-medium hover:text-ocean transition-colors max-w-xxs",
        variant === "mobile" && "p-3"
      )}
    >
      {!loaded && <ImageLoader height={280} />}
      <img
        src={coverImage}
        className={`w-80 rounded-lg ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ transition: "opacity 0.5s ease-in-out" }}
        onLoad={() => setLoaded(true)}
      />
      <h5 className="font-medium text-text-secondary text-xs mt-2">
        {subtitle}
      </h5>
      <h3 className="heading-h5 text-text-primary">{title}</h3>
      <div className="mt-3 font-semibold flex w-full justify-between">
        <span>{linkText}</span>
        <Icon name="arrowRight" />
      </div>
    </a>
  );
}

export function NavCard({
  title,
  subtitle,
  url,
  coverImage,
  linkText,
}: NavCardProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a
      href={url}
      className="bg-white p-2 rounded-lg shadow-medium text-text-secondary  hover:text-ocean transition-colors w-full grid grid-cols-5 gap-4"
    >
      <div className="col-span-2 relative pb-9/16">
        {!loaded && <ImageLoader height={90} />}
        <img
          src={coverImage}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover rounded-lg ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: "opacity 0.5s ease-in-out" }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="col-span-3">
        <h5 className="font-medium text-text-secondary text-xs mt-2 uppercase">
          {subtitle}
        </h5>
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <div className="mt-3 font-semibold flex text-sm w-full justify-between">
          <span>{linkText}</span>
          <Icon name="arrowRight" />
        </div>
      </div>
    </a>
  );
}
