import { cn } from "~/lib/utils";

const BulletPoints = ({
  dotStyles = "black",
  points,
  className,
  textStyles,
}: {
  points: string[];
  dotStyles?: string;
  className?: string;
  textStyles?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {points.map((point, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`size-2 rounded-full flex-shrink-0 ${dotStyles}`}
            aria-hidden="true"
          />
          <p
            className={cn("text-text-primary font-medium text-sm", textStyles)}
          >
            {point}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BulletPoints;
