import type { PodcastShow } from "../../types";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { Link } from "react-router-dom";

type PodcastCardProps = {
  podcast: PodcastShow;
  className?: string;
};

export function PodcastHubCard({ podcast, className = "" }: PodcastCardProps) {
  const { title, description, apple, spotify, amazon, url, coverImage } =
    podcast;

  const links = [
    {
      label: "Apple Music",
      icon: "appleLogo",
      href: apple,
    },
    {
      label: "Spotify",
      icon: "spotify",
      href: spotify,
    },
    {
      label: "Amazon Music",
      icon: "amazonMusic",
      href: amazon,
    },
  ];

  return (
    <div
      className={`flex relative overflow-hidden ${className} px-8 py-12 group w-full lg:justify-center`}
    >
      {/* Desktop */}
      <div className="hidden relative md:flex flex-col lg:flex-row lg:justify-between gap-8 max-w-screen-content">
        {/* Image */}
        <img
          src={coverImage}
          alt={title}
          className="object-cover bg-cover w-full h-[360px] lg:h-[282px] lg:w-[480px] xl:w-[590px] xl:h-[350px] rounded-lg"
        />

        {/* Content */}
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-[32px] font-extrabold">{title}</h3>
          <p className="text-xl text-[#767676] lg:max-w-[540px]">
            {description}
          </p>
          <div className="flex items-center gap-8 w-full">
            <Button intent="secondary" href={url || ""} className="h-full">
              Episodes and More
            </Button>

            <div className="flex gap-2">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  target="_blank"
                  className="flex flex-col items-center justify-center gap-1 bg-[#0092BC] rounded-lg size-[54px]"
                >
                  <Icon
                    name={link.icon as any}
                    color="white"
                    size={link.icon === "amazonMusic" ? 36 : 24}
                    className={`${link.icon === "amazonMusic" ? "-mt-1" : ""}`}
                  />
                  <p
                    className={`text-[7px] font-extrabold text-white ${
                      link.icon === "amazonMusic" ? "-mt-2" : ""
                    }`}
                  >
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="relative max-w-screen-content md:hidden">
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-[32px] font-extrabold">{title}</h3>
              <p className="text-sm text-[#767676]">{description}</p>
            </div>
            <img
              src={coverImage}
              alt={title}
              className="object-cover bg-cover w-full h-[360px] rounded-lg"
            />
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            <Button
              intent="secondary"
              href={url || ""}
              target="_blank"
              linkClassName="w-full"
              className="w-full"
            >
              Episodes and More
            </Button>

            <div className="flex gap-2">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  target="_blank"
                  className="flex flex-col items-center justify-center gap-1 bg-[#0092BC] rounded-lg size-[72px]"
                >
                  <Icon
                    name={link.icon as any}
                    color="white"
                    size={link.icon === "amazonMusic" ? 50 : 36}
                    className={`${link.icon === "amazonMusic" ? "-mt-1" : ""}`}
                  />
                  <p
                    className={`text-[7px] font-extrabold text-white ${
                      link.icon === "amazonMusic" ? "-mt-2" : ""
                    }`}
                  >
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
