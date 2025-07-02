import type { Podcast } from "../../types";
import lodash from "lodash";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { icons } from "~/lib/icons";
import { Link } from "react-router-dom";

type PodcastCardProps = {
  podcast: Podcast;
  className?: string;
};

export function PodcastHubCard({ podcast, className = "" }: PodcastCardProps) {
  const { title, description, shareLinks } = podcast;
  const { kebabCase } = lodash;

  const platformToIcon: Record<string, keyof typeof icons> = {
    "Apple Music": "appleLogo",
    Spotify: "spotify",
    "Amazon Music": "amazonMusic",
  };

  const links = shareLinks.map((link) => ({
    label: link.title,
    icon: platformToIcon[link.title] || "link",
    href: link.url,
  }));

  return (
    <div
      className={`flex relative overflow-hidden ${className} px-8 py-12 group w-full lg:justify-center`}
    >
      {/* Desktop */}
      <div className="hidden relative md:flex flex-col lg:flex-row lg:justify-between gap-8 max-w-screen-content">
        {/* Image */}
        <img
          src={"/assets/images/podcasts/temp-embed.jpg"}
          alt={title}
          className="object-cover bg-cover w-full h-[360px] lg:h-[282px] lg:w-[480px] xl:w-[590px] xl:h-[350px]"
        />

        {/* Content */}
        <div className="flex flex-col justify-center gap-4">
          <h3 className="text-[32px] font-extrabold">{title}</h3>
          <p className="text-xl text-[#767676] lg:max-w-[540px]">
            {description}
          </p>
          <div className="flex items-center gap-8 w-full">
            <Button
              intent="secondary"
              href={`/podcasts/${kebabCase(title)}`}
              className="h-full"
            >
              Episodes and More
            </Button>

            <div className="flex gap-2">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="flex flex-col items-center justify-center gap-1 bg-[#0092BC] rounded-lg size-[54px]"
                >
                  <Icon
                    name={link.icon}
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
              src={"/assets/images/podcasts/temp-embed.jpg"}
              alt={title}
              className="object-cover bg-cover w-full h-[360px]"
            />
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            <Button
              intent="secondary"
              href={`/podcasts/${kebabCase(title)}`}
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
                  className="flex flex-col items-center justify-center gap-1 bg-[#0092BC] rounded-lg size-[72px]"
                >
                  <Icon
                    name={link.icon}
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
