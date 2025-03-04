import { Link } from "react-router-dom";
import type { PodcastType } from "../../types";
import { Icon } from "~/primitives/icon/icon";

type PodcastCardProps = {
  podcast: PodcastType;
  className?: string;
};

const iconStyles =
  "text-white rotate-[135deg] transition-transform duration-300 group-hover:rotate-180 size-10";

export function PodcastCard({ podcast, className = "" }: PodcastCardProps) {
  const { title, image, tags, href } = podcast;

  return (
    <Link
      to={href}
      className={`flex flex-col relative group overflow-hidden ${className} border-b-8 border-ocean group`}
    >
      <div className="relative aspect-square overflow-hidden">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {/* content overlay */}
        <div className="py-10 px-4 absolute bottom-0 left-0 w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/75 z-10" />
          <div className="relative z-20">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-4xl font-bold mb-3 text-white">{title}</h3>
              <Icon name="arrowBack" className={iconStyles} />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-xs bg-transparent border border-white text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
