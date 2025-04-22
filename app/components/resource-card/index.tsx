export function ResourceCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="pt-1">
      <div className="rounded-[8px] border border-neutral-lighter overflow-hidden shadow-md cursor-pointer hover:translate-y-[-4px] transition-all duration-300">
        <img
          src={image}
          alt={title}
          className="w-full aspect-video object-cover"
        />
        <div className="flex flex-col p-6 gap-4 bg-white">
          <h3 className="text-[24px] font-bold leading-none">{title}</h3>
          <p className="text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
}
