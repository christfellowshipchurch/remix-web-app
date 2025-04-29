import { Link } from "react-router-dom";

export function ResourceCard({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  return (
    <div className="h-full pt-1">
      <Link
        to={url}
        prefetch="intent"
        className="rounded-[8px] border border-neutral-lighter overflow-hidden shadow-md cursor-pointer hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full"
      >
        <img
          src={image}
          alt={title}
          className="w-full aspect-video object-cover"
        />
        <div className="flex flex-col p-6 gap-4 bg-white flex-1">
          <h3 className="text-[24px] font-bold leading-none">{title}</h3>
          <p className="text-text-secondary flex-1">{description}</p>
        </div>
      </Link>
    </div>
  );
}
