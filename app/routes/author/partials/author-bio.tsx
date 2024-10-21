import * as Avatar from "@radix-ui/react-avatar";
import ShareLinks from "~/components/share-links/share-links.component";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";
import { AuthorArticleProps } from "../components/author-content";

type SocialMedia = {
  type: string;
  url: string;
};

type AuthorProps = {
  fullName: string;
  profilePhoto: string;
  authorAttributes: {
    bio: string;
    jobTitle: string;
    socialLinks: SocialMedia[];
    publications: AuthorArticleProps[];
  };
};

export function AuthorBioDesktop({
  fullName,
  profilePhoto,
  authorAttributes,
}: AuthorProps) {
  const { bio, jobTitle, socialLinks } = authorAttributes;

  return (
    <div className="flex flex-col gap-5 font-light text-neutral-700">
      <Avatar.Root>
        <Avatar.Image
          className="size-32 rounded-full"
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
      {bio && <p>{bio}</p>}
      <div className="flex gap-2">
        {socialLinks && <ShareLinks size={10} socialMedia={socialLinks} />}
      </div>
    </div>
  );
}

export function AuthorBioMobile({
  fullName,
  profilePhoto,
  authorAttributes,
}: AuthorProps) {
  const { bio, jobTitle, socialLinks } = authorAttributes;

  return (
    <div className="flex flex-col gap-8 font-light text-neutral-700">
      <div className="flex items-center gap-4">
        <Avatar.Root>
          <Avatar.Image
            className="w-32 rounded-full"
            src={profilePhoto}
            alt={fullName}
          />
          <Avatar.Fallback className="flex size-full">
            <CircleLoader size={20} />
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <h2 className="text-2xl font-semibold">{fullName}</h2>
          {jobTitle && <h3 className="text-lg">{jobTitle}</h3>}
        </div>
      </div>
      <div className="flex gap-2">
        {socialLinks && <ShareLinks size={8} socialMedia={socialLinks} />}
      </div>
      {bio && <p>{bio}</p>}
    </div>
  );
}
