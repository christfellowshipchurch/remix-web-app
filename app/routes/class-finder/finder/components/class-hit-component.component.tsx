/**
 * This component is used to display a hit (cards) in the class finder.
 */

import { ClassHitType } from "../../types";
import { Link } from "react-router-dom";

export function ClassHitComponent({
  hit,
  fromClassFinderUrl,
}: {
  hit: ClassHitType;
  fromClassFinderUrl?: string;
}) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";

  return (
    <Link
      to={`/class-finder/${hit.classTypeUrl || hit.title}`}
      state={
        fromClassFinderUrl ? { fromClassFinder: fromClassFinderUrl } : undefined
      }
      className="size-full"
    >
      <div
        className="mb-4 bg-white rounded-lg overflow-hidden w-full max-w-[360px] md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px] cursor-pointer hover:translate-y-[-2px] transition-all duration-300 h-full flex flex-col"
        style={{
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex flex-col h-full">
          <img
            src={coverImage}
            alt={hit.title}
            className="w-full h-[250px] lg:h-[180px] object-cover overflow-hidden flex-shrink-0"
          />

          <div className="flex flex-col gap-5 px-6 pb-4 pt-5 w-full h-full flex-1">
            {/* Attributes */}
            <div className="flex flex-wrap gap-[6px]">
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {hit.topic}
              </p>
              <p className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
                {hit.campus.name}
              </p>
            </div>

            {/* Description Info */}
            <div className="flex flex-col gap-[10px]">
              <div className="flex flex-col gap-2">
                {/* Title */}
                <h3 className="text-lg font-bold leading-tight line-clamp-2">
                  {hit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-black line-clamp-3">{hit.summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
