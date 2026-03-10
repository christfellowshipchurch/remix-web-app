import { Link } from "react-router";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";
import { Icon } from "~/primitives/icon/icon";

export const SiteBanner = ({
  content,
  onClose,
  link = "",
}: {
  content: string;
  link?: string;
  onClose: () => void;
}) => {
  const isExternal = link ? link.startsWith("http") : false;
  const hasLink = Boolean(link);

  return (
    <div className="bg-ocean content-padding flex items-center justify-center w-full relative top-0 z-999">
      <div className="text-white text-center py-2 flex justify-between items-center w-full">
        {hasLink ? (
          isExternal ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full no-underline text-white hover:text-gray-200 transition-colors duration-200"
            >
              <HTMLRenderer html={content || ""} />
            </a>
          ) : (
            <Link
              to={link}
              className="w-full no-underline text-white hover:text-gray-200 transition-colors duration-200"
            >
              <HTMLRenderer html={content || ""} />
            </Link>
          )
        ) : (
          <span className="w-full text-white">
            <HTMLRenderer html={content || ""} />
          </span>
        )}

        <div className="ml-auto cursor-pointer" onClick={onClose}>
          <Icon name="x" size={32} />
        </div>
      </div>
    </div>
  );
};
