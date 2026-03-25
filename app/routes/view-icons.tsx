import { useMemo } from "react";
import type { ReactElement } from "react";
import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";

interface IconEntry {
  name: keyof typeof icons;
}

export function ViewIconsRoute(): ReactElement {
  // Get all SVG icon names from the imported icons object
  const iconEntries: IconEntry[] = useMemo(() => {
    return Object.keys(icons).map((name) => ({
      name,
    })) as IconEntry[];
  }, []);

  return (
    <main className="py-8 px-4">
      <h1 className="text-3xl font-semibold mb-8">CFDP Web Icons</h1>
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {iconEntries.map(({ name }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
              <Icon name={name} size={32} aria-label={name} />
            </div>
            <span className="text-xs text-gray-700 wrap-break-word select-all">
              {name}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}

export { ViewIconsRoute as default };
