export function GroupsSingleHero({ imagePath }: { imagePath: string }) {
  return (
    <div
      className="w-full h-[276px] lg:h-[340px] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${imagePath})` }}
    >
      <div className="absolute inset-0 bg-black opacity-20" />
    </div>
  );
}
