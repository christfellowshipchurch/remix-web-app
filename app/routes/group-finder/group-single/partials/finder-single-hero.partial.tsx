import { cn } from "~/lib/utils";

export function FinderSingleHero({
  imagePath,
  // Default is set to Group Finder Hero Height
  height = 374,
}: {
  imagePath: string;
  height?: number;
}) {
  return (
    <div
      className={cn("w-full bg-cover bg-center relative")}
      style={{ backgroundImage: `url(${imagePath})`, height: height }}
    >
      <div className="absolute inset-0 bg-black opacity-20" />
    </div>
  );
}
