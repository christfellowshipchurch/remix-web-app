import Button from "~/primitives/button";
import Video from "~/primitives/Video";
import Icon from "~/primitives/icon";

type SearchProps = {
  setAddress: (address: string) => void;
  getCoordinates: () => void;
  searchScroll: () => void;
  searchCurrentLocation: () => void;
  locationActive: boolean;
};

export const Search = ({
  setAddress,
  searchCurrentLocation,
  searchScroll,
  getCoordinates,
  locationActive,
}: SearchProps) => {
  return (
    <div className="flex h-[56vw] w-full items-center justify-center">
      <div className="relative flex size-full overflow-hidden">
        <Video
          wistiaId="padj4c4xoh"
          autoPlay
          loop
          muted
          className="absolute left-0 top-0 size-full object-cover"
        />
        <div className="absolute size-full bg-[rgba(0,0,0,0.5)]" />
        <div className="absolute left-1/2 top-1/2 flex w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-6 rounded-xl bg-black/45 py-12 text-center text-white backdrop-blur lg:max-w-[900px]">
          <h1 className="text-[36px] font-bold">
            Christ Fellowship Church Locations
          </h1>
          <p className="max-w-[90vw] text-xl md:max-w-[560px]">
            Christ Fellowship is one church with many locations across South
            Florida, and online—wherever you are!
          </p>
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex w-[60vw] justify-between md:w-[440px] ">
              <input
                className="w-full rounded-md bg-white px-6 py-3  text-center text-xl text-black"
                placeholder="Enter zip code here"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div
              onClick={() => {
                searchScroll();
                getCoordinates();
              }}
            >
              <Button size="md">Find a Location</Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div
                className="cursor-pointer italic underline"
                onClick={() => searchCurrentLocation()}
              >
                Use my current location
              </div>
              <Icon size={16} color="white" name="locationArrow" />
            </div>
            {!locationActive && (
              <div className="text-sm italic text-alert">
                Enable Location Access & Try Again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
