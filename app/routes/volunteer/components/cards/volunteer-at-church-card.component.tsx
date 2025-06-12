import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "~/primitives/icon/icon";
import { CollectionItem } from "~/routes/page-builder/types";

export const VolunteerAtChurchCard = ({
  resource,
}: {
  resource: CollectionItem;
}) => {
  const tempRoles = ["Role 1", "Role 2", "Role 3"];
  return (
    <div className="flex flex-col rounded-[1rem] overflow-hidden md:shrink-0 md:w-[347px] h-full">
      <img
        className="w-full max-h-[170px] object-cover"
        src={resource.image}
        alt={resource.name}
      />
      <div className="flex flex-col justify-between gap-8 p-6 bg-white size-full">
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h2 className="text-navy text-xl font-extrabold leading-none">
              {resource.name}
            </h2>
            <p className="hidden md:block text-ocean text-sm">
              {resource.description}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-sm">{resource.summary}</p>
            <RolesExpandable roles={tempRoles} />
          </div>
        </div>

        <Link
          to={resource.pathname}
          className="flex gap-2 w-full h-fit pt-4 border-t border-[#DFE1E7] hover:text-ocean transition-colors duration-300"
        >
          <Icon name="arrowTopRight" className="text-ocean" size={14} />
          <p className="text-lg font-bold">Sign Up</p>
        </Link>
      </div>
    </div>
  );
};

const RolesExpandable = ({ roles }: { roles: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="cursor-pointer flex items-center gap-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-sm text-semibold text-ocean">
          {isExpanded ? "Hide" : "View specific"} roles
        </p>
        <Icon
          name={isExpanded ? "chevronUp" : "chevronDown"}
          size={16}
          className="text-ocean"
        />
      </div>
      {isExpanded && (
        <ul className="flex flex-col gap-2">
          {roles.map((role) => (
            <li
              key={role}
              className="flex items-center gap-2 text-text-secondary"
            >
              <span className="w-1 h-1 rounded-full bg-text-secondary" />
              {role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
