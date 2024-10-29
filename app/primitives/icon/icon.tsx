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

  // TODO: Icons won't shrink or expand
  if (Array.isArray(path)) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        fillRule={fillRule}
        clipRule={clipRule}
        viewBox={`0 0 ${width || size} ${height || size}`}
        stroke={stroke}
        className={`overflow-visible flex items-center align-center self-center align-middle ${className}`}
        width={width || size}
        height={height || size}
      >
        {path.map((d, i) => {
          return <path d={d?.d} key={i} fill={color || d?.fill || "none"} />;
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
      viewBox={`0 0 ${width || size} ${height || size}`}
      stroke={stroke}
      className={`flex items-center align-center self-center align-middle ${className}`}
      width={width || size}
      height={height || size}
    >
      <path d={path} fill={color || "none"} />
    </svg>
  );
};
