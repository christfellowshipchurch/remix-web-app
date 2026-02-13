import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import { Icon } from "~/primitives/icon/icon";
import { ImageSource } from "~/routes/group-finder/types";

export const GroupSingleBanner = ({
  language,
  topics,
  leaderImages,
  groupName,
}: {
  language: "English" | "Spanish" | "Español";
  topics: string[];
  leaderImages: ImageSource[];
  groupName: string;
}) => {
  const location = useLocation();
  const backToGroupFinderUrl =
    typeof location.state?.fromGroupFinder === "string"
      ? location.state.fromGroupFinder
      : "/group-finder";

  const imageStyles =
    "size-16 md:size-20 rounded-lg md:rounded-[10px] object-cover ";

  //  If language is Spanish, add "Español" to the list of Tags displayed
  const tags =
    language === "Spanish" || language === "Español"
      ? ["Español", ...topics]
      : topics;

  return (
    <div
      className={cn(
        "w-full bg-white content-padding pt-8 pb-4 sticky top-0 z-10 shadow-sm"
      )}
    >
      <div className="max-w-screen-content mx-auto w-full flex justify-between gap-8 items-center">
        {/* Left Side Content*/}

        {/* Mobile Content - Leader Images */}
        <div className="flex md:hidden gap-2">
          <Link to={backToGroupFinderUrl} className="flex items-center">
            <Icon name="arrowBack" size={24} className="text-navy" />
          </Link>
          {leaderImages.slice(0, 2).map((image) => (
            <img
              key={image.sources[0].uri}
              src={image.sources[0].uri}
              alt={groupName}
              className={imageStyles}
            />
          ))}
        </div>

        {/* Desktop Content*/}
        <div className="hidden md:flex gap-6 lg:gap-8">
          <div className="flex items-center gap-4">
            <Link to={backToGroupFinderUrl} className="flex items-center group">
              <Icon
                name="arrowBack"
                size={24}
                className="text-navy group-hover:text-dark-navy group-hover:-translate-x-[2px] transition-all duration-300"
              />
            </Link>

            <img
              src={leaderImages[0].sources[0].uri}
              alt={groupName}
              className={imageStyles}
            />
          </div>

          <div className="flex flex-col justify-between gap-2">
            <p className="text-[28px] lg:text-[32px] font-extrabold leading-[130%]">
              {groupName}
            </p>
            <div className="flex gap-[6px]">
              {tags.map((tag, index) => (
                <TopicBadge key={index} label={tag} isPrimary={index === 0} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Button */}
        <Button
          intent="primary"
          href="#todo"
          className="min-w-0 px-2 md:px-4 lg:px-5 min-h-0 py-2 md:py-3 text-base lg:text-lg"
        >
          I'm Interested
        </Button>
      </div>
    </div>
  );
};

export const TopicBadge = ({
  label,
  isPrimary,
}: {
  label: string;
  isPrimary: boolean;
}) => {
  return (
    <div
      className={cn(
        "w-fit flex rounded-sm text-sm font-semibold p-[6px]",
        isPrimary
          ? "bg-dark-navy text-navy-subdued"
          : "bg-navy-subdued text-dark-navy"
      )}
    >
      {label}
    </div>
  );
};
