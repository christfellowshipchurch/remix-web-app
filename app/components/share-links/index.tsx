import { useLoaderData, useLocation } from "react-router-dom";
import CopyToClipboard from "./copy-link.component";
import Icon from "~/primitives/icon";

const socialIcons: {
  name: "linkAlt" | "linkedIn" | "twitter" | "facebook" | "instagram";
  color?: string;
}[] = [
  { name: "linkAlt" },
  { name: "linkedIn" },
  { name: "twitter" },
  { name: "facebook" },
  { name: "instagram" },
];

type ShareLinksProps = {
  size: number;
  url?: string;
  overrideCopyUrl?: string;
  backgroundColor?: string;
  socialMedia: SocialMedia[];
  hideSocialLinks?: boolean;
};

type SocialMedia = { type: string; url: string };

export function ShareLinks({
  size: _size = 8,
  socialMedia,
  url,
  overrideCopyUrl,
  backgroundColor,
  hideSocialLinks = false,
}: ShareLinksProps) {
  // Add the host URL to the loader data in the route loader, since we can't use window or access env via client-side
  const data = useLoaderData<{ hostUrl?: string }>();
  const hostUrl = url || data?.hostUrl;
  const { pathname } = useLocation();
  const fullPath = `${hostUrl}${pathname}`;

  if (hideSocialLinks) {
    return null;
  }

  return socialIcons?.map((icon, index) => {
    const socialLink = socialMedia?.find(
      (media) => media?.type === icon?.name
    )?.url;
    if (socialLink) {
      return (
        <a
          target="_blank"
          key={index}
          href={socialLink && socialLink}
          rel="noreferrer"
        >
          <Icon
            name={icon?.name}
            size={38}
            color="#0092bc"
            className={`duration-300 hover:scale-105 p-1 rounded-full ${
              backgroundColor || "bg-white"
            }`}
          />
        </a>
      );
    } else if (icon?.name === "linkAlt") {
      return (
        <div key={index}>
          <CopyToClipboard textToCopy={overrideCopyUrl || fullPath}>
            <Icon
              name="linkAlt"
              size={38}
              className={`duration-300 hover:scale-105 p-1 rounded-full ${
                backgroundColor || "bg-white"
              }`}
            />
          </CopyToClipboard>
        </div>
      );
    }
    return null;
  });
}
