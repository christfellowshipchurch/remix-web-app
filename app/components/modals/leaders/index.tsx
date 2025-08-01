import * as Avatar from "@radix-ui/react-avatar";
import { ShareLinks } from "~/components/share-links";
import { cn } from "~/lib/utils";
import { CircleLoader } from "~/primitives/loading-states/circle-loader.primitive";
import { AuthorArticleProps } from "~/routes/author/components/author-content";
import AuthorTabs from "~/routes/author/components/author-tabs";
import { Author } from "~/routes/author/loader";

export const LeadersModal = ({ author }: { author: Author | null }) => {
  if (!author) {
    return (
      <div className="w-[80vw] max-h-[85vh] md:max-h-[90vh] md:w-full md:max-w-[85vw] 2xl:max-w-[70vw]">
        <div className="size-full flex">
          {/* Left Side Loading Skeleton */}
          <div className="w-1/2 p-4">
            <div className="animate-pulse">
              <div className="h-32 w-32 rounded-full bg-gray-200 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>

          {/* Right Side Loading Skeleton */}
          <div className="w-1/2 p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden",
        "max-w-screen-content",
        "h-[85vh]",
        "xl:!w-6xl",
        "lg:w-4xl",
        "md:w-2xl",
        "sm:w-lg",
        "w-[350px]"
      )}
    >
      <div className="h-full flex flex-col lg:flex-row w-full rounded-xl">
        {/* Left Side */}
        <div className="w-full lg:w-2/5 p-4 md:p-16 md:pt-8 flex-shrink-0">
          <div className="hidden md:block">
            <AuthorBioDesktop
              id={author?.id}
              homeUrl={author?.hostUrl}
              fullName={author?.fullName}
              profilePhoto={author?.profilePhoto}
              authorAttributes={author?.authorAttributes}
            />
          </div>

          <div className="md:hidden">
            <AuthorBioMobile
              id={author?.id}
              homeUrl={author?.hostUrl}
              fullName={author?.fullName}
              profilePhoto={author?.profilePhoto}
              authorAttributes={author?.authorAttributes}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-3/5 px-4 bg-white md:py-4 flex-1 overflow-hidden rounded-r-xl">
          <AuthorTabs articles={author?.authorAttributes?.publications} />
        </div>
      </div>
    </div>
  );
};

export function AuthorBioDesktop({
  id,
  homeUrl,
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
        {socialLinks && (
          <ShareLinks
            overrideCopyUrl={`${homeUrl}/author/${id}`}
            size={10}
            socialMedia={socialLinks}
          />
        )}
      </div>
    </div>
  );
}

type SocialMedia = {
  type: string;
  url: string;
};

type AuthorProps = {
  id: string;
  homeUrl: string;
  fullName: string;
  profilePhoto: string;
  authorAttributes: {
    bio: string;
    jobTitle: string;
    socialLinks: SocialMedia[];
    publications: AuthorArticleProps[];
  };
};

export function AuthorBioMobile({
  id,
  fullName,
  profilePhoto,
  authorAttributes,
  homeUrl,
}: AuthorProps) {
  const { bio, jobTitle, socialLinks } = authorAttributes;

  return (
    <div className="flex flex-col gap-8 font-light text-neutral-700 w-full">
      <div className="flex flex-col gap-4 w-full">
        <Avatar.Root>
          <Avatar.Image
            className="w-32 rounded-[32px]"
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
      </div>

      <div className="flex gap-2">
        {socialLinks && (
          <ShareLinks
            url={`${homeUrl}/author/${id}`}
            size={8}
            socialMedia={socialLinks}
          />
        )}
      </div>

      {bio && <p>{bio}</p>}
    </div>
  );
}
