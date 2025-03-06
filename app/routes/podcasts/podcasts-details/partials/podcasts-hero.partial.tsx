import heroBgImgStyles from "~/styles/hero-bg-image-styles";
import { Podcast } from "../loader";
import Breadcrumbs from "~/components/breadcrumbs";
import { Icon } from "~/primitives/icon/icon";

interface PodcastsHeroProps {
  podcast: Podcast;
}

export const PodcastsHero: React.FC<PodcastsHeroProps> = ({
  podcast,
}: PodcastsHeroProps) => {
  const { title, description, coverImage } = podcast;

  return (
    <div style={heroBgImgStyles(coverImage)}>
      <div className="bg-white/80 backdrop-blur-lg px-6 md:px-16">
        <div className="flex py-10">
          <div className="flex flex-col-reverse md:flex-row md:items-center lg:items-start mx-auto justify-between w-full max-w-[1438px]">
            <div className="flex flex-col justify-center lg:w-2/5 mt-4 md:mt-24 mr-10 mb-6 md:mb-0">
              {title && (
                <h1
                  className="mb-2 md:mb-4 max-w-2xl font-extrabold text-2xl text-pretty md:text-4xl leading-tight tracking-tight text-white  md:leading-tight lg:text-6xl"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {description && (
                <p
                  className="mb-6 max-w-2xl font-medium text-white md:text-xl lg:mb-8"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
              <div className="flex items-center gap-2">
                <div className="bg-ocean rounded-full p-3">
                  <Icon name="play" color="white" />
                </div>
                <p className="text-white text-lg font-semibold">
                  START LISTENING
                </p>
              </div>
            </div>
            {/* Cover Image - 4:3 ratio on lg screens */}
            <img
              className="rounded-md h-[230px] md:h-full w-full object-cover md:max-w-[250px] lg:max-w-[570px]"
              src={coverImage}
              alt={title || "Cover"}
            />
          </div>
        </div>
        <div className="max-w-screen-content mx-auto">
          <div className="h-[2px] w-full bg-[#D9D9D9] opacity-50" />
          <div className="flex flex-col md:flex-row justify-between items-center py-10">
            <Breadcrumbs mode="light" />
          </div>
        </div>
      </div>
    </div>
  );
};
