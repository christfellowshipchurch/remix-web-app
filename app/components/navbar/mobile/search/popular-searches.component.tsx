import { useRouteLoaderData } from "react-router-dom";
import { useSearchBox } from "react-instantsearch";
import type { RootLoaderData } from "~/routes/navbar/loader";

export const PopularSearches = () => {
  const { refine } = useSearchBox();
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined;
  const popularSearches = rootData?.popularSearches ?? [];

  if (popularSearches.length === 0) {
    return (
      <div className="flex flex-col">
        <h2 className="text-xl text-[#00354D] font-extrabold leading-none">
          Popular Searches
        </h2>
        <p className="mt-2 text-[#7B7380] text-sm">
          Start typing to search. Enable Algolia Analytics to show top searches
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-xl text-[#00354D] font-extrabold leading-none">
        Popular Searches
      </h2>
      <ul className="mt-2">
        {popularSearches.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => refine(term)}
              className="w-full text-left py-4 border-b border-[#E0E0E0] text-black font-medium hover:text-navy transition-colors"
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
