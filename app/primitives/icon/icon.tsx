import { icons } from "~/lib/icons";

export const Icon = ({
  className = "",
  clipRule = "evenodd",
  fillRule = "evenodd",
  color,
  height,
  name,
  size = 24,
  stroke = "none",
  width,
}: {
  className?: string;
  clipRule?: string;
  color?: string;
  fillRule?: "evenodd" | "nonzero" | "inherit";
  height?: number;
  name: keyof typeof icons;
  stroke?: string;
  size?: number;
  width?: number;
}) => {
  const path = icons[name];

  if (Array.isArray(path)) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        fillRule={fillRule}
        clipRule={clipRule}
        viewBox={`0 0 24 24`}
        stroke={stroke}
        className={`overflow-visible flex items-center align-center self-center align-middle ${className}`}
        width={width || size}
        height={height || size}
      >
        {path.map((d, i) => {
          return (
            <path
              d={d?.d}
              key={i}
              fill={color || ("fill" in d ? d.fill : "black")}
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      fillRule={fillRule}
      clipRule={clipRule}
      viewBox={`0 0 24 24`}
      stroke={stroke}
      className={`flex items-center align-center self-center align-middle ${className}`}
      width={width || size}
      height={height || size}
    >
      <path d={path} fill={color || "black"} />
    </svg>
  );
};
