import { Link, useLocation } from "react-router";
import Icon from "~/primitives/icon";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const pageName = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <div key={path} className="flex items-center gap-4 text-[#ADA09B]">
        <Icon color="#0092BC" size={20} name="caretRight" />
        <Link className="hover:underline text-sm" to={path}>
          {pageName}
        </Link>
      </div>
    );
  });

  return (
    <div className="flex items-center gap-4 text-[#ADA09B]">
      <Link className="hover:underline text-sm" to="/">
        Home
      </Link>
      {breadcrumbs}
    </div>
  );
}
