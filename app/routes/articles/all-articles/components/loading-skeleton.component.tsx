export const DesktopLoadingSkeleton = () => {
  return (
    <>
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="w-[320px] lg:w-[440px] xl:w-[410px] h-[350px] bg-gray-100 animate-pulse rounded-lg"
        />
      ))}
    </>
  );
};
