import { icons } from '~/lib/icons';

interface IconProps {
  className?: string;
  clipRule?: string;
  color?: string;
  fillRule?: 'evenodd' | 'nonzero' | 'inherit';
  height?: number;
  id?: string;
  name: keyof typeof icons;
  stroke?: string;
  size?: number;
  width?: number;
  style?: React.CSSProperties;
}

export const Icon = ({
  className = '',
  clipRule = 'evenodd',
  fillRule = 'evenodd',
  color,
  height,
  id,
  name,
  size = 24,
  stroke = 'none',
  width,
  style,
}: IconProps) => {
  const path = icons[name];

  if (Array.isArray(path)) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
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
        {path.map((entry, i) => {
          if (typeof entry !== 'object' || entry == null || !('d' in entry)) {
            return null;
          }
          const strokePath =
            'stroke' in entry &&
            entry.stroke != null &&
            String(entry.stroke).length > 0;
          const fill = strokePath
            ? 'fill' in entry && entry.fill !== undefined
              ? entry.fill
              : 'none'
            : color ||
              ('fill' in entry && entry.fill !== undefined
                ? entry.fill
                : 'currentColor');
          return (
            <path
              d={entry.d}
              key={i}
              fill={fill}
              fillOpacity={'fillOpacity' in entry ? entry.fillOpacity : 1}
              stroke={strokePath ? color || entry.stroke : undefined}
              strokeWidth={
                strokePath && 'strokeWidth' in entry
                  ? entry.strokeWidth
                  : undefined
              }
              strokeLinecap={
                strokePath && 'strokeLinecap' in entry
                  ? (entry.strokeLinecap as
                      | 'round'
                      | 'butt'
                      | 'square'
                      | undefined)
                  : undefined
              }
            />
          );
        })}
      </svg>
    );
  }

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
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
      <path d={path} fill={color || 'currentColor'} />
    </svg>
  );
};
