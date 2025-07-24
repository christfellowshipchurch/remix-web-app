import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";

export const SubscribeSection = ({
  apple,
  spotify,
  amazon,
}: {
  apple: string;
  spotify: string;
  amazon: string;
}) => {
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
    <div className="w-full bg-linear-to-br from-[#1C3647] to-navy content-padding">
      <div className="max-w-screen-content mx-auto py-16">
        <div className="flex flex-col items-center gap-8 text-white">
          <h2 className="text-[24px] md:text-[28px] font-extrabold leading-none">
            Subscribe and follow
          </h2>
          <div className="flex gap-4 w-full justify-center sm:w-auto md:gap-12">
            {links.map((link, index) => (
              <div
                className="flex flex-col items-center justify-center gap-2 bg-[#0092BC] rounded-lg size-[100px] p-2 sm:p-4 sm:size-[120px] hover:scale-105 transition-all duration-300 cursor-pointer"
                key={index}
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <Icon
                    name={link.icon as keyof typeof icons}
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
