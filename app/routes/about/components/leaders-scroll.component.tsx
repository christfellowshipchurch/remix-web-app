import { leaders } from "./leaders-data";
import { cn } from "~/lib/utils";

export function LeaderScroll() {
  const seniorLeaders = leaders.slice(0, 1)[0];
  const otherLeaders = leaders.slice(1, leaders.length);

  return (
    <div className="ml-4 md:ml-12">
      {/* Senior Leaders */}
      <div
        key={seniorLeaders.name}
        className="relative min-w-[200px] mb-6 mr-4 md:mr-12"
      >
        <div className="relative mb-6">
          <img
            src="/assets/images/about/todd-julie.webp"
            alt={seniorLeaders.name}
            className="w-full aspect-[3/2] sm:aspect-[16/9] md:aspect-[16/7] object-cover object-top rounded-[8px]"
          />
          <div
            className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
            aria-label={`Learn more about ${seniorLeaders.name}`}
          >
            <span className="text-2xl font-light">+</span>
          </div>
        </div>
        <div>
          <p className="text-gray-600 uppercase tracking-wider text-sm mb-1">
            {seniorLeaders.role}
          </p>
          <h4 className="text-2xl font-bold text-gray-900">
            {seniorLeaders.name}
          </h4>
        </div>
      </div>

      {/* Other Leaders */}
      <div className="flex items-start lg:items-end gap-3 overflow-scroll sm:mr-4 md:mr-12 pr-4">
        {otherLeaders.map((leader, index) => (
          <div
            key={leader.name}
            className={cn(
              `group min-w-[220px] sm:min-w-none`
              // index === otherLeaders.length - 1 && "pr-4 lg:pr-0"
            )}
          >
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-[8px]">
                <img
                  src={leader.imagePath}
                  alt={leader.name}
                  className={cn(
                    "w-full aspect-[32/46] object-cover",
                    "transform transition-transform duration-300 group-hover:scale-105"
                  )}
                />
              </div>
              <div
                className="absolute right-2 -bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-label={`Learn more about ${leader.name}`}
              >
                <span className="text-2xl font-light">+</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 uppercase tracking-wider text-sm mb-1">
                {leader.role}
              </p>
              <h4 className="text-2xl font-bold text-gray-900">
                {leader.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
