import { Icon } from "~/primitives/icon/icon";
import { leaders } from "./leaders-data";
import { cn } from "~/lib/utils";

export function LeaderGrid() {
  return (
    <div className="flex items-start lg:items-end gap-3">
      {leaders.map((leader, index) => (
        <div
          key={leader.name}
          className={cn(
            "group w-full",
            "md:w-[50%]",
            "lg:w-[25%]",
            index === 0 && "lg:w-[28%]",
            "cursor-pointer"
          )}
        >
          <div className="relative mb-6">
            <div className="relative overflow-hidden rounded-[8px]">
              <img
                src={leader.imagePath}
                alt={leader.name}
                className={cn(
                  "w-full aspect-[32/46] object-cover",
                  "transform transition-transform duration-300 group-hover:scale-105"
                )}
              />
              <div className="absolute size-[212px]">
                {/* TOOD: Update logo to be the correct size */}
                <Icon
                  name="logo"
                  className="absolute bototm-0 left-0 object-contain size-full text-ocean group-hover:text-white transform transition-all duration-300 group-hover:-translate-y-36"
                />
              </div>
            </div>
            <div
              className="absolute right-2 -bottom-4 w-10 h-10 bg-white group-hover:bg-ocean group-hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
              aria-label={`Learn more about ${leader.name}`}
            >
              <span className="text-2xl font-light">+</span>
            </div>
          </div>

          <div>
            <p className="text-gray-600 uppercase tracking-wider text-sm mb-1">
              {leader.role}
            </p>
            <h4 className="text-2xl font-bold text-gray-900">{leader.name}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
