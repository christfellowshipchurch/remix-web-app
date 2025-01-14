import { useLoaderData, useLocation } from "react-router";
import CopyLink from "./copy-link.component";
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
  socialMedia: SocialMedia[];
};

type SocialMedia = { type: string; url: string };

export default function ShareLinks({ size = 8, socialMedia }: ShareLinksProps) {
  // Add the host URL to the loader data in the route loader, since we can't use window or access env via client-side. We'll use "any" return type for flexibliity
  const data = useLoaderData<any>();
  const { hostUrl } = data;
  const { pathname } = useLocation();
  const fullPath = `${hostUrl}${pathname}`;

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
            className="duration-300 hover:scale-105 p-1 rounded-full bg-neutral-lightest"
          />
        </a>
      );
    } else if (icon?.name === "linkAlt") {
      return (
        <div key={index}>
          <CopyLink textToCopy={fullPath}>
            <Icon
              name="linkAlt"
              size={38}
              className="duration-300 hover:scale-105 p-1 rounded-full bg-neutral-lightest"
            />
          </CopyLink>
        </div>
      );
    }
    return null;
  });
}
