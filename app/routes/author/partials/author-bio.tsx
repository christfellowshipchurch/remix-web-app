import * as Avatar from "@radix-ui/react-avatar";
import { ShareLinks } from "~/components";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";
import { AuthorBioProps } from "../types";

export function AuthorBio({
  author,
  homeUrl,
  variant = "default",
  hideSocialLinks = false,
}: AuthorBioProps) {
  const { id, fullName, profilePhoto, authorAttributes } = author;
  const { bio, jobTitle, socialLinks } = authorAttributes;

  // Determine styling based on variant
  const isLeadersVariant = variant === "leaders";
  const avatarRounded = isLeadersVariant ? "rounded-[32px]" : "rounded-full";
  const shareLinksSize = isLeadersVariant ? 10 : 8;
  const circleLoaderSize = isLeadersVariant ? 32 : 20;

  // ShareLinks props based on variant
  const shareLinksProps =
    isLeadersVariant && id && homeUrl
      ? {
          overrideCopyUrl: `${homeUrl}/author/${id}`,
          size: shareLinksSize,
          socialMedia: socialLinks,
        }
      : {
          url: id && homeUrl ? `${homeUrl}/author/${id}` : undefined,
          size: shareLinksSize,
          socialMedia: socialLinks,
        };

  return (
    <div className="flex flex-col gap-5 md:gap-8 font-light text-neutral-700 pr-0 md:pr-8 lg:pr-0 w-full">
      {/* Desktop layout: vertical stack */}
      <div className="hidden md:flex flex-col gap-5">
        <Avatar.Root>
          <Avatar.Image
            className={`size-32 object-cover object-center ${avatarRounded}`}
            src={profilePhoto}
            alt={fullName}
          />
          <Avatar.Fallback className="flex size-full">
            <CircleLoader size={32} />
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          {jobTitle && <h3 className="text-lg">{jobTitle}</h3>}
        </div>
        {bio && (
          <p>
            <HTMLRenderer html={bio} />
          </p>
        )}
        {!hideSocialLinks && (
          <div className="flex gap-2">
            {socialLinks && <ShareLinks {...shareLinksProps} />}
          </div>
        )}
      </div>

      {/* Mobile layout: horizontal avatar + name, then social links, then bio */}
      <div className="flex md:hidden flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <Avatar.Root>
            <Avatar.Image
              className={`w-32 h-32 object-cover object-center ${avatarRounded}`}
              src={profilePhoto}
              alt={fullName}
            />
            <Avatar.Fallback className="flex size-full">
              <CircleLoader size={circleLoaderSize} />
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <h2 className="text-2xl font-semibold">{fullName}</h2>
            {jobTitle && <h3 className="text-lg">{jobTitle}</h3>}
          </div>
        </div>
        {!hideSocialLinks && (
          <div className="flex gap-2">
            {socialLinks && <ShareLinks {...shareLinksProps} />}
          </div>
        )}
        {bio && (
          <p>
            <HTMLRenderer html={bio} />
          </p>
        )}
      </div>
    </div>
  );
}

// Keep the old exports for backward compatibility during transition
export const AuthorBioDesktop = AuthorBio;
export const AuthorBioMobile = AuthorBio;
