import * as Avatar from "@radix-ui/react-avatar";
import { useLoaderData, useLocation } from "@remix-run/react";
import CopyLink from "./copy-link.component";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";

import shareIcon from "~/assets/icons/share.svg";
import linkedInIcon from "~/assets/icons/indeed.svg";
import twitterIcon from "~/assets/icons/x.svg";
import facebookIcon from "~/assets/icons/facebook.svg";
import instagramIcon from "~/assets/icons/instagram.svg";

const socialIcons = [
  { name: "Share", src: shareIcon },
  { name: "linkedIn", src: linkedInIcon },
  { name: "twitter", src: twitterIcon },
  { name: "facebook", src: facebookIcon },
  { name: "instagram", src: instagramIcon },
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
    // TODO: Review .svgs used here and if instagram is working.
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
          <Avatar.Root className="flex cursor-pointer duration-300 hover:scale-105">
            <Avatar.Image
              className={`size-${size} rounded-full`}
              src={icon.src}
              alt={icon.name}
            />
            <Avatar.Fallback className="flex size-full">
              <CircleLoader size={size} />
            </Avatar.Fallback>
          </Avatar.Root>
        </a>
      );
    } else if (icon?.name === "Share") {
      return (
        <div key={index}>
          <CopyLink textToCopy={fullPath}>
            <Avatar.Root className="flex cursor-pointer duration-300 hover:scale-105">
              <Avatar.Image
                className={`size-${size} rounded-full`}
                src={icon?.src}
                alt={icon.name}
              />
              <Avatar.Fallback className="flex size-full">
                <CircleLoader size={size} />
              </Avatar.Fallback>
            </Avatar.Root>
          </CopyLink>
        </div>
      );
    }
    return null;
  });
}
