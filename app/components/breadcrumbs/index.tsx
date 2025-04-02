import { Link, useLocation } from "react-router";
import Icon from "~/primitives/icon";

interface BreadcrumbsProps {
  mode?: "light" | "dark" | "darker";
}

export function Breadcrumbs({ mode = "dark" }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const textColor = (() => {
    switch (mode) {
      case "light":
        return "text-[#F4F4F4]";
      case "dark":
        return "text-[#ADA09B]";
      case "darker":
        return "text-[#3C3C3C]";
      default:
        return "text-[#ADA09B]";
    }
  })();

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const pageName = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div key={path} className={`flex items-center gap-4 ${textColor}`}>
        <Icon
          className="text-ocean min-w-[20px] block"
          size={20}
          name="caretRight"
        />
        <Link to={path}>
          <span className="hover:underline text-sm line-clamp-2">
            {decodeURIComponent(pageName)}
          </span>
        </Link>
      </div>
    );
  });

  return (
    <div className={`flex items-center gap-4 ${textColor}`}>
      <Link to="/">
        <span className="hover:underline text-sm">Home</span>
      </Link>
      {breadcrumbs}
    </div>
  );
}
