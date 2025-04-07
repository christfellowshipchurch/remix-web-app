export const PopularSearches = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl text-[#00354D] font-extrabold leading-none">
        Popular Searches
      </h2>
      <div className="h-[1px] bg-[#E0E0E0] w-full mt-4" />
      {/* TODO: Figure out how to get the popular searches from Algolia */}
      <ul>
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
