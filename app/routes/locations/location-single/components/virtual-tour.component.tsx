import * as Tabs from "@radix-ui/react-tabs";
import { Icon } from "~/primitives/icon/icon";
import { Video } from "~/primitives/video/video.primitive";

export const VirtualTour = ({
  wistiaId,
  address,
}: {
  wistiaId: string;
  address: string;
}) => {
  return (
    <div className="flex flex-col py-8 rounded-[18px] border border-neutral-lighter">
      <Tabs.Root defaultValue="tour">
        <TabContent
          value="map"
          address={address}
          title="Visit Us"
          description="Come experience our campus in person! Our friendly staff is ready
              to give you a tour and answer any questions you may have about our
              programs and facilities."
        />
        <TabContent
          value="tour"
          title="Take a Virtual Tour"
          description="Experience our campus before you visit. "
          wistiaId={wistiaId}
        />

        <Tabs.List className="flex gap-4 p-8">
          <TourButton value="map">Map</TourButton>
          <TourButton value="tour">Virtual Tour</TourButton>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

const TourButton = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Trigger
      className="flex-1 w-full max-w-[300px] py-2 flex gap-2 items-center justify-center text-sm font-semibold rounded-[200px] md:rounded-[400px] border border-[#D6D6D6] text-black"
      value={value}
    >
      <Icon
        name={value === "map" ? "mapAlt" : "video"}
        size={20}
        color="black"
      />
      {children}
    </Tabs.Trigger>
  );
};

const TabContent = ({
  address,
  title,
  description,
  wistiaId,
  value,
}: {
  address?: string;
  title: string;
  description: string;
  wistiaId?: string;
  value: string;
}) => {
  return (
    <Tabs.Content value={value}>
      <div className="flex flex-col p-8 !pt-0">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
      </div>

      {/* TODO: ImplementGoogle Maps */}
      {address && <div>{address}</div>}
      {wistiaId && (
        // Use desktop wistiaId on mobile as well since the design is the same (not vertical)
        <Video wistiaId={wistiaId} className="aspect-67/35" controls={false} />
      )}
    </Tabs.Content>
  );
};
