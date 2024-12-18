import Icon from "~/primitives/icon";
import { GroupHit } from "../types";
import { useState } from "react";
import Button from "~/primitives/button";

export function HitComponent({ hit }: { hit: GroupHit }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coverImage = hit.coverImage?.sources?.[0]?.uri || "";
  const meetingType = hit.meetingType;
  const tags = hit.preferences.join(", ");

  return (
    <div
      className="h-full mb-4 bg-white rounded-lg overflow-hidden"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex flex-col h-full pb-6">
        <div className="relative flex flex-col gap-2">
          <img
            src={coverImage}
            alt={hit.title}
            className="w-full h-48 object-cover mb-4 overflow-hidden"
          />
          <div className="flex gap-1 absolute -bottom-4 right-4">
            {hit?.leaders.map((leader, i) => (
              <img
                className="rounded-lg stroke-[#EBEBEF] size-20"
                src={leader.photo.uri}
                key={i}
                alt={leader.firstName}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 px-4 h-full justify-between">
          <div className="flex flex-col gap-1">
            <div className="bg-[#EBEBEB] w-fit flex rounded-sm text-xs font-semibold px-2 py-1">
              {meetingType}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold leading-6 text-text-primary">
                {hit.title}
              </h3>
              <p className="text-sm text-black">{tags}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon name="map" size={20} color="black" />
              <p className="text-sm font-semibold">{hit.campusName}</p>
            </div>

            <div className="flex items-center gap-2">
              <Icon name="calendarAlt" size={20} color="black" />
              <p className="text-sm font-semibold">{hit.meetingDay}</p>
            </div>
            <div>
              <p
                className={`text-sm text-text-primary ${
                  isExpanded ? "" : "line-clamp-3"
                }`}
              >
                {hit.summary}
              </p>
              {hit.summary.length > 132 && (
                <button
                  className="text-ocean text-sm font-semibold text-start"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "See Less" : "See More"}
                </button>
              )}
            </div>
          </div>
          {/* TODO: Open Contact Group Leader Modal */}
          <Button className="rounded-lg font-semibold h-12">Contact</Button>
        </div>
      </div>
    </div>
  );
}
