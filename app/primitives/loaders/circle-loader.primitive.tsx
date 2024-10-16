export function CircleLoader({ size = 16 }) {
  return (
    <div className="animate-pulse">
      <div className={`size-${size} rounded-full bg-slate-200`}></div>
    </div>
  );
}
