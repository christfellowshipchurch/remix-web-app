import { Link, useLocation } from "react-router";
import Icon from "~/primitives/icon";

export default function Breadcrumbs() {
  const location = useLocation();
  const pagePath =
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )[0] || "Home";

  return (
    <div className="flex items-center gap-4 text-[#ADA09B]">
      <Link className="hover:underline text-sm" to="/">
        Home
      </Link>
      <Icon color="#0092BC" size={20} name="caretRight" />
      <Link className="hover:underline text-sm" to={location.pathname}>
        {pagePath}
      </Link>
    </div>
  );
}
