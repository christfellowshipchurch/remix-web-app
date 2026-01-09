import * as Tabs from "@radix-ui/react-tabs";
import { useLoaderData } from "react-router-dom";
import { Icon } from "~/primitives/icon/icon";
import { Video } from "~/primitives/video/video.primitive";
import { LoaderReturnType } from "../loader";
import { cn } from "~/lib/utils";

const GoogleMap = ({
  address,
  apiKey,
}: {
  address: string;
  apiKey: string;
}) => {
  const encodedAddress = encodeURIComponent(address);
  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export const VirtualTourTabs = ({
  wistiaId,
  address,
  isOnline,
  isSpanish,
}: {
  wistiaId: string;
  address?: string;
  isOnline?: boolean;
  isSpanish?: boolean;
}) => {
  const { GOOGLE_MAPS_API_KEY } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col pt-8 rounded-[18px] border border-neutral-lighter">
      <Tabs.Root defaultValue={wistiaId ? "tour" : "map"}>
        {!isOnline && address && GOOGLE_MAPS_API_KEY && (
          <TabContent
            value="map"
            isOnline={isOnline}
            address={address}
            apiKey={GOOGLE_MAPS_API_KEY}
            title={isSpanish ? "Visítanos" : "Visit Us"}
            description={
              isSpanish
                ? "Ven a conocer nuestro campus en persona! Nuestro personal amable está listo para darte un tour y responder cualquier pregunta que tengas sobre nuestros programas y instalaciones."
                : "Come experience our campus in person! Our friendly staff is ready to give you a tour and answer any questions you have about our programs and facilities."
            }
          />
        )}
        {wistiaId && (
          <TabContent
            isOnline={isOnline}
            value="tour"
            title={
              isOnline
                ? "Join Us Online!"
                : isSpanish
                ? "Toma Un Tour Virtual"
                : "Take a Virtual Tour"
            }
            description={
              isOnline
                ? "Experience what it’s like to attend Christ Fellowship before your visit, or watch our live stream."
                : isSpanish
                ? "Experimenta lo que es ser parte de Christ Fellowship antes de tu visita."
                : "Experience what it’s like to attend Christ Fellowship before your visit."
            }
            wistiaId={wistiaId}
          />
        )}

        {!isOnline && address && GOOGLE_MAPS_API_KEY && (
          <Tabs.List className="flex justify-center gap-4 p-8">
            <>
              <TourButton value="map">{isSpanish ? "Mapa" : "Map"}</TourButton>
              {wistiaId && (
                <TourButton value="tour">
                  {isSpanish ? "Tour Virtual" : "Virtual Tour"}
                </TourButton>
              )}
            </>
          </Tabs.List>
        )}
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
      className="flex-1 w-full max-w-[300px] py-2 flex gap-2 items-center justify-center text-sm font-semibold rounded-[200px] md:rounded-[400px] border border-[#D6D6D6] text-black data-[state=active]:bg-gray cursor-pointer"
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
  apiKey,
  isOnline,
}: {
  address?: string;
  title: string;
  description: string;
  wistiaId?: string;
  value: string;
  apiKey?: string;
  isOnline?: boolean;
}) => {
  return (
    <Tabs.Content value={value}>
      <div className="flex flex-col p-5 md:p-8 !pt-0">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
      </div>

      {address && value === "map" && apiKey && (
        <GoogleMap address={address} apiKey={apiKey} />
      )}

      {wistiaId && value === "tour" && (
        <Video
          wistiaId={wistiaId}
          className={`aspect-67/35 relative z-3 ${
            isOnline ? "rounded-b-[18px]" : ""
          }`}
          controls={false}
        />
      )}
    </Tabs.Content>
  );
};
