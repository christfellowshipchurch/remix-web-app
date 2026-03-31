import { useMemo } from "react";
import { useInstantSearch } from "react-instantsearch";
import { Icon } from "~/primitives/icon/icon";

type RefinementChip = {
  key: string;
  attribute: string;
  value: string;
  label: string;
};

export function ActiveFilters() {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const refinementList = (indexUiState.refinementList ?? {}) as Record<
    string,
    string[]
  >;
  const refinementChips = useMemo((): RefinementChip[] => {
    const out: RefinementChip[] = [];
    for (const [attribute, values] of Object.entries(refinementList)) {
      if (!Array.isArray(values)) continue;
      for (const raw of values) {
        if (raw == null || String(raw).trim() === "") continue;
        const value = String(raw);
        out.push({
          key: `${attribute}:${value}`,
          attribute,
          value,
          label: value,
        });
      }
    }
    return out;
  }, [refinementList]);

  if (refinementChips.length === 0) return null;

  const removeRefinement = (attribute: string, value: string) => {
    setIndexUiState((state) => {
      const rl = {
        ...(state.refinementList as Record<string, string[]> | undefined),
      };
      const current = rl[attribute] ?? [];
      const next = current.filter((v) => v !== value);
      if (next.length === 0) delete rl[attribute];
      else rl[attribute] = next;
      return { ...state, refinementList: rl, page: 0 };
    });
  };

  const chipClassName =
    "bg-ocean/10 text-ocean font-semibold text-sm min-h-0 min-w-0 px-3 py-2 rounded-[999px] flex flex-row items-center gap-1.5 cursor-pointer hover:bg-ocean/20 transition-colors";

  return (
    <div className="flex flex-row md:flex-wrap items-center gap-2 pt-4 pb-6 max-w-screen-content mx-auto border-t border-neutral-lighter/15">
      <p className="text-neutral-default font-semibold text-sm shrink-0">
        Active<span className="inline md:hidden">:</span>{" "}
        <span className="hidden md:inline">Filters:</span>
      </p>
      <div className="flex flex-row flex-wrap gap-2">
        {refinementChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            className={chipClassName}
            aria-label={`Remove filter ${chip.label}`}
            onClick={() => removeRefinement(chip.attribute, chip.value)}
          >
            <span className="max-w-[220px] truncate" title={chip.label}>
              {chip.label}
            </span>
            <Icon name="x" className="text-ocean shrink-0" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
