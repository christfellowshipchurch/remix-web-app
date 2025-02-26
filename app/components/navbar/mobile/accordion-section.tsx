import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";
import { SubMenuItem } from "./types";

interface AccordionSectionProps {
  id: string;
  title: string;
  description: string;
  items: SubMenuItem[];
  isOpen: boolean;
  onToggle: (id: string) => void;
  layout?: "list" | "grid";
  showViewMore?: boolean;
}

export function AccordionSection({
  id,
  title,
  description,
  items,
  isOpen,
  onToggle,
  layout = "list",
  showViewMore = false,
}: AccordionSectionProps) {
  return (
    <>
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between py-4 mb-0 border-t border-gray-200"
      >
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-lg font-bold text-navy">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <Icon
          name="chevronDown"
          className={`size-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-4">
          {layout === "list" ? (
            <div className="space-y-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex justify-start items-center gap-4"
                >
                  <div className="mt-1">
                    {item.icon && (
                      <Icon name={item.icon} className="size-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {items.map((item) => (
                <Link key={item.id} to={item.to} className="flex flex-col">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {showViewMore && (
            <Link
              to={`/${id}`}
              className="mt-6 flex items-center text-primary font-semibold"
            >
              View More
              <Icon name="arrowRight" className="ml-2 size-5" />
            </Link>
          )}
        </div>
      )}
    </>
  );
}
