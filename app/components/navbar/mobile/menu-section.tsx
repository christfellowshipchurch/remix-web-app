import { Link } from "react-router-dom";
import Icon from "~/primitives/icon";
import { MenuItem } from "./types";

interface MenuSectionProps {
  title?: string;
  items: MenuItem[];
}

export function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <section className="px-8 border-t border-gray-200 py-8">
      {title && <h2 className="heading-h6 text-navy mb-4">{title}</h2>}
      <div className="space-y-6">
        {items.map((item) => (
          <Link key={item.id} to={item.to} className="flex items-start gap-6">
            <div className="mt-1">
              <Icon name={item.icon} className="size-6 text-text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{item.title}</h3>
              <p className="text-text-secondary text-sm font-normal">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
