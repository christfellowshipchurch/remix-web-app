import heroBgImgStyles from "~/styles/hero-bg-image-styles";
import { Podcast } from "../loader";
import Breadcrumbs from "~/components/breadcrumbs";
import { HeroContent } from "../components/hero-content.component";

interface PodcastsHeroProps {
  podcast: Podcast;
}

export const PodcastsHero: React.FC<PodcastsHeroProps> = ({
  podcast,
}: PodcastsHeroProps) => {
  const { title, description, coverImage } = podcast;

  return (
    <div className="w-full" style={heroBgImgStyles(coverImage)}>
      <div className="bg-white/80 backdrop-blur-lg">
        <HeroContent
          title={title}
          description={description}
          coverImage={coverImage}
        />
        <div className="content-padding">
          <div className="max-w-screen-content mx-auto">
            <div className="h-[2px] w-full bg-[#D9D9D9] opacity-50" />
            <div className="flex flex-col md:flex-row justify-between items-center py-10">
              <Breadcrumbs mode="light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
