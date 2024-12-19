export function ImageLoader({ height = 100 }: { height?: number | string }) {
  return (
    <div className="animate-pulse">
      <div
        style={{ height }}
        className={`w-full rounded-lg bg-slate-200`}
      ></div>
    </div>
  );
}
