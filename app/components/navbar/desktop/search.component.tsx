import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const SearchPopup = () => {
  return (
    <div className="absolute left-0 top-[56px] w-[60vw] bg-[#F3F5FA] rounded-b-lg shadow-lg p-4">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-xs text-[#2F2F2F] opacity-50 font-semibold">
            I'M LOOKING FOR
          </h2>
          <div className="flex justify-between mt-4">
            {[
              "Events",
              "Articles",
              "Messages",
              "Pages",
              "People",
              "Podcasts",
            ].map((label) => (
              <Button
                key={label}
                size="md"
                intent="secondary"
                className="border-[#AAAAAA] text-[#444444] border-[0.7px]"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-6 space-y-4">
        {/* <div className="flex flex-col gap-2 mt-4">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="file" size={14} />
                      Article
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="calendar" size={14} />
                      Event
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="windowAlt" size={14} />
                      Ministry Page
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="moviePlay" size={14} />
                      Message
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="user" size={14} />
                      Author
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gray hover:bg-neutral-200 transition-colors">
                      <Icon name="microphone" size={14} />
                      Podcast
                    </button>
                  </div> */}
      </div>
    </div>
  );
};

export const SearchExpanded = ({
  mode,
  setIsSearchOpen,
}: {
  mode: "light" | "dark";
  setIsSearchOpen: (isSearchOpen: boolean) => void;
}) => {
  return (
    <div className="flex w-full items-center">
      <button
        onClick={() => setIsSearchOpen(false)}
        className="flex items-center"
      >
        <Icon
          name="search"
          size={20}
          className={`text-ocean
          ${
            mode === "light"
              ? "text-neutral-dark"
              : "text-white group-hover:text-text"
          } hover:text-neutral-dark transition-colors cursor-pointer
        `}
        />
      </button>
      <input
        id="search-bar"
        type="text"
        placeholder=""
        className="w-full px-3 py-1 text-sm outline-none transition-all"
        autoFocus
      />
      <button
        onClick={() => {
          const searchInput = document.getElementById(
            "search-bar"
          ) as HTMLInputElement;
          if (searchInput) searchInput.value = "";
        }}
        className="ml-2"
      >
        <Icon
          name="x"
          size={16}
          className={`
            ${
              mode === "light" ? "text-neutral-dark" : "text-white"
            } hover:text-ocean transition-colors
          `}
        />
      </button>
    </div>
  );
};
