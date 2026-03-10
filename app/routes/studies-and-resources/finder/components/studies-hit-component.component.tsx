/**
 * Displays a single study/resource hit (card) in the studies and resources finder.
 */

import { Icon } from "~/primitives/icon/icon";
import { StudyHitType } from "../../types";
import { Link } from "react-router-dom";
import { StudiesTagItem } from "../../studies-single/partials/basic-content.partial";

export function StudyHitComponent({
  hit,
  fromStudiesFinderUrl,
}: {
  hit: StudyHitType;
  fromStudiesFinderUrl?: string;
}) {
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";

  return (
    <Link
      to={`/studies-and-resources/${hit.url}`}
      state={
        fromStudiesFinderUrl
          ? { fromStudiesAndResources: fromStudiesFinderUrl }
          : undefined
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
            className="w-full h-[250px] lg:h-[180px] object-cover overflow-hidden shrink-0"
          />

          <div className="flex flex-col gap-5 px-6 pb-4 pt-5 w-full h-full flex-1">
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

            {/* Attributes */}
            <div className="flex flex-wrap gap-[6px]">
              <StudiesTagItem icon="bible" label={hit.format} />
              <StudiesTagItem label={hit.topic} />
              <StudiesTagItem icon="alarm" label={hit.duration} />
              <StudiesTagItem icon="user" label={hit.audience} />
              <StudiesTagItem icon="church" label={hit.source} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
