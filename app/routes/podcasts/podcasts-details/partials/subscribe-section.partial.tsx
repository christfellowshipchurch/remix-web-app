import { useLoaderData } from "react-router-dom";
import { icons } from "~/lib/icons";
import { LoaderReturnType } from "../loader";
import Icon from "~/primitives/icon";

export const SubscribeSection = () => {
  const { podcast } = useLoaderData<LoaderReturnType>();
  const { shareLinks } = podcast;

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
    <div className="w-full bg-linear-to-br from-[#1C3647] to-[#004F71] content-padding">
      <div className="max-w-screen-content mx-auto py-16">
        <div className="flex flex-col items-center gap-8 text-white">
          <h2 className="text-[24px] md:text-[28px] font-extrabold leading-none">
            Subscribe and follow
          </h2>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto md:gap-12">
            {links.map((link, index) => (
              <div
                className="flex flex-col items-center gap-2 bg-[#0092BC] rounded-lg w-full p-2 sm:p-4 sm:w-[140px] md:p-8 md:w-[160px]"
                key={index}
              >
                <a href={link.href}>
                  <Icon
                    name={link.icon}
                    size={link.icon === "amazonMusic" ? 62 : 52}
                  />
                </a>
                <p
                  className={`text-[10px] md:text-xs font-extrabold ${
                    link.icon === "amazonMusic" ? "-mt-3" : ""
                  }`}
                >
                  {link.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
