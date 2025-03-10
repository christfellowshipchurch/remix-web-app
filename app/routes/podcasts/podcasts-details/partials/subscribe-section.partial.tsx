import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";

export const SubscribeSection = () => {
  //TODO: Update href with the correct podcast URL
  const links: { label: string; icon: keyof typeof icons; href: string }[] = [
    {
      label: "Apple Music",
      icon: "appleLogo",
      href: "#",
    },
    {
      label: "Spotify",
      icon: "appleLogo",
      href: "#",
    },
    {
      label: "Amazon Music",
      icon: "appleLogo",
      href: "#",
    },
  ];

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
                  <Icon name={link.icon} size={52} />
                </a>
                <p className="text-[10px] md:text-xs font-extrabold">
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
