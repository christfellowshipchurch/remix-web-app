import { cn } from "~/lib/utils";

interface Stat {
  year?: string;
  label: string;
  value: string;
}

interface Avatar {
  src: string;
  alt: string;
}

interface VolunteerStatsProps {
  stats: Stat[];
  avatars: Avatar[];
  avatarCount: number;
}

export function VolunteerStats({
  stats = defaultProps.stats,
  avatars = defaultProps.avatars,
  avatarCount = defaultProps.avatarCount,
}: VolunteerStatsProps) {
  return (
    <section id="stats" className="w-full bg-white py-20 content-padding">
      <div className="max-w-screen-content mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:flex w-full gap-6 justify-between items-end">
          {stats.map((stat, _idx) => (
            <div
              className="flex flex-col-reverse lg:flex-col items-start justify-between h-full xl:min-w-[278px]"
              key={stat.label}
            >
              <div
                className={cn(
                  "w-full border-b-2 border-neutral-lighter",
                  "text-neutral-default font-bold",
                  "mb-1 pt-1",
                  "grid grid-cols-3 gap-2",
                  "md:flex md:justify-between md:items-end"
                )}
              >
                <span className="col-span-1">
                  {stat.year && `${stat.year}`}
                </span>
                <span className="col-span-2 text-right text-pretty pl-8">
                  {stat.label}
                </span>
              </div>
              <div className="text-ocean text-[52px] lg:text-7xl font-extrabold">
                {stat.value}
              </div>
            </div>
          ))}
          <div className="flex flex-col-reverse lg:flex-col items-start min-w-[288px]">
            <div className="w-full border-b-2 border-neutral-lighter text-neutral-default font-bold mb-1 pt-1">
              More than, 3.4k Dream Team
            </div>
            <div className="flex items-center mb-6 lg:mb-0 mt-2">
              <div className="flex -space-x-4">
                {avatars.map((avatar, _i) => (
                  <img
                    key={avatar.src}
                    src={avatar.src}
                    alt={avatar.alt}
                    className="w-[64px] h-[64px] rounded-full shadow-md"
                  />
                ))}
                <div className="w-[64px] h-[64px] rounded-full bg-ocean text-white flex items-center justify-center  shadow-md">
                  {avatarCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const defaultProps = {
  stats: [
    { year: "2024", label: "Volunteers served", value: "14,378" },
    {
      year: "2024",
      label: "People impacted through missions outreach",
      value: "108k",
    },
    { year: "2024", label: "International Missions Trips", value: "15" },
  ],
  avatars: [
    { src: "https://picsum.photos/id/1011/70/70", alt: "Avatar 1" },
    { src: "https://picsum.photos/id/1012/70/70", alt: "Avatar 2" },
    { src: "https://picsum.photos/id/1015/70/70", alt: "Avatar 3" },
    { src: "https://picsum.photos/id/1016/70/70", alt: "Avatar 4" },
  ],
  avatarCount: 3456,
};
