import { Link } from "react-router";
import { cn } from "~/lib/utils";
import Icon from "~/primitives/icon";

const BackBanner = ({
  backText,
  pageTitle,
  link,
  bg = "white",
}: {
  backText: string;
  pageTitle: string;
  link: string;
  bg?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full py-[15px] shadow-sm content-padding sticky top-0",
        `bg-${bg}`
      )}
    >
      <div className="max-w-screen-content mx-auto w-full flex gap-4 items-center md:gap-6">
        <Link to={link} prefetch="intent" className="flex gap-4">
          <Icon name="arrowBack" color="black" size={16} />
          <p className="text-xs font-bold text-black">{backText}</p>
        </Link>

        <p className="text-xs text-black font-medium">{pageTitle}</p>
      </div>
    </div>
  );
};

export default BackBanner;
