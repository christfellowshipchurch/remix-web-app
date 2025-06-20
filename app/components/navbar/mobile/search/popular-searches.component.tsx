export const PopularSearches = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl text-[#00354D] font-extrabold leading-none">
        Popular Searches
      </h2>
      {/* TODO: Figure out how to get the popular searches from Algolia */}
      <ul className="mt-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <li
            key={num}
            className="py-4 border-b border-[#E0E0E0] text-black font-medium"
          >
            Popular Search {num}
          </li>
        ))}
      </ul>
    </div>
  );
};
