import { Link, useLocation } from "react-router";
import Icon from "~/primitives/icon";

interface BreadcrumbsProps {
  mode?: "light" | "dark";
}

export default function Breadcrumbs({ mode = "dark" }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const textColor = mode === "light" ? "text-[#948984]" : "text-[#ADA09B]";

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const pageName = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div key={path} className={`flex items-center gap-4 ${textColor}`}>
        <Icon color="#0092BC" size={20} name="caretRight" />
        <Link to={path}>
          <span className="hover:underline text-sm">{pageName}</span>
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
