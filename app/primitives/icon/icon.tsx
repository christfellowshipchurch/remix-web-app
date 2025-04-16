import { icons } from "~/lib/icons";

interface IconProps {
  className?: string;
  clipRule?: string;
  color?: string;
  fillRule?: "evenodd" | "nonzero" | "inherit";
  height?: number;
  id?: string;
  name: keyof typeof icons;
  stroke?: string;
  size?: number;
  width?: number;
  style?: React.CSSProperties;
}

export const Icon = ({
  className = "",
  clipRule = "evenodd",
  fillRule = "evenodd",
  color,
  height,
  id,
  name,
  size = 24,
  stroke = "none",
  width,
  style,
}: IconProps) => {
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
        style={style}
        id={id || `icon-${name}`}
      >
        {path.map((d, i) => {
          return (
            <path
              d={d?.d}
              key={i}
              fill={color || ("fill" in d ? d.fill : "currentColor")}
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
      style={style}
      id={id}
    >
      <path d={path} fill={color || "currentColor"} />
    </svg>
  );
};
