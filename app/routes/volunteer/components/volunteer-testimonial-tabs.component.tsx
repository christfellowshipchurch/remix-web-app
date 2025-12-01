import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { useRef, useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Video } from "~/primitives/video/video.primitive";

export const VolunteerTestimonialTabs = () => {
  return (
    <Tabs.Root
      defaultValue={volunteerTestimonialsData[0].title}
      className="flex flex-col gap-12"
    >
      <Tabs.List className="flex gap-8 xl:gap-10 w-full">
        {volunteerTestimonialsData.map((item, index) => (
          <Tabs.Trigger
            key={index}
            value={item.title}
            className="w-full group cursor-pointer"
          >
            <div className="flex flex-col gap-4 rounded-[9px] transition-all duration-300 group-hover:bg-gray group-data-[state=active]:bg-gray p-3 max-[420px] w-full">
              <div className="flex items-center gap-4">
                <img
                  src={item.data.thumbnail}
                  className="w-[80px] aspect-square rounded-lg object-cover bg-center"
                />

                <div className="flex flex-col text-start">
                  <p className="text-xl font-extrabold">{item.title}</p>
                  <p className="text-lg text-text-secondary font-bold">
                    {item.data.role}
                  </p>
                </div>
              </div>

              <div className="h-[5px] w-full bg-gray group-hover:bg-ocean group-data-[state=active]:bg-ocean transition-all duration-300" />
            </div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {volunteerTestimonialsData.map((tab, index) => (
        <Tabs.Content value={tab.title} key={index}>
          <TestimonialDesktopCard data={tab.data} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

const TestimonialDesktopCard = ({
  data,
}: {
  data: VolunteerTestimonialCardType["data"];
}) => {
  const { content, name, role, video } = data;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
  };

  // TODO: Once the videos are ready in Wistia they should be set to autoplay and hide controls on load, so that when the user clicks our play button, the video renders and it starts playing.
  return (
    <div className="w-full rounded-[1rem] overflow-hidden pt-12 pb-16 xl:py-24 max-w-[1200px] h-[520px] flex items-center relative">
      {!isPlaying && (
        <div className="w-[400px] flex flex-col gap-8 ml-8 px-8 py-12 bg-white rounded-[1rem] relative z-2">
          <div className="flex flex-col">
            <h4 className="text-lg font-extrabold leading-tight">{name}</h4>
            <p className="font-bold text-text-secondary">{role}</p>
          </div>
          <p className="text-text-secondary">{content}</p>
        </div>
      )}

      {/* Video */}
      <div className="absolute size-full overflow-hidden">
        {isPlaying ? (
          <>
            <Video wistiaId={video} controls className="size-full" />
            <div
              className="absolute top-5 left-5 rounded-full bg-[#3D3D3D]/50 p-2 cursor-pointer hover:bg-[#3D3D3D]/70 transition-colors"
              onClick={handlePauseClick}
            >
              <div className="relative">
                <Icon name="arrowBack" color="white" />
              </div>
            </div>
          </>
        ) : (
          <div
            className="size-full cursor-pointer group overflow-hidden transition-opacity duration-300"
            onClick={handlePlayClick}
          >
            <img
              src={data.thumbnail}
              alt={name}
              className="w-full h-full object-cover rounded-[12px]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-[12px]" />
            <div className="absolute bottom-5 right-5 rounded-full bg-[#3D3D3D]/50 p-3 cursor-pointer hover:bg-[#3D3D3D]/70 transition-colors">
              <div className="relative -right-[2px] size-10 xl:size-16">
                <Icon
                  name="play"
                  color="white"
                  className="size-10 xl:size-16"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const VolunteerTestimonialsMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Handles centering the middle card on mobile
  useEffect(() => {
    if (!containerRef.current || window.innerWidth >= 1024) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll("[data-card]");
    if (cards.length === 0) return;

    // Find the middle card
    const middleIndex = Math.floor(cards.length / 2);
    const middleCard = cards[middleIndex] as HTMLElement;
    if (!middleCard) return;

    // Calculate scroll position to center the middle card
    const containerWidth = container.clientWidth;
    const cardWidth = middleCard.offsetWidth;
    const cardOffset = middleCard.offsetLeft;
    const scrollPosition = cardOffset - (containerWidth - cardWidth) / 2;

    // Scroll to center
    container.scrollTo({
      left: scrollPosition,
      behavior: "auto",
    });
  }, []);

  const handleVideoClick = (index: number) => {
    // If clicking the same video that's playing, stop it
    if (playingIndex === index) {
      setPlayingIndex(null);
    } else {
      // Otherwise, play the new video
      setPlayingIndex(index);
    }
  };

  return (
    <div className="lg:hidden w-full">
      <div className="flex flex-col gap-4 w-full overflow-x-auto pb-2">
        <div
          ref={containerRef}
          className={cn(
            "flex gap-4 flex-nowrap overflow-x-auto pt-2",
            "items-center md:justify-center w-full"
          )}
        >
          {volunteerTestimonialsData.map((item, index) => {
            const { video, mobileContent, name, role, thumbnail } = item.data;
            const isPlaying = playingIndex === index;

            return (
              <div
                key={index}
                data-card
                className="w-[220px] h-[290px] rounded-lg relative flex-shrink-0"
                style={{
                  marginLeft: index === 0 ? "8px" : "0",
                  marginRight:
                    index === volunteerTestimonialsData.length - 1
                      ? "8px"
                      : "0",
                }}
              >
                {isPlaying ? (
                  <div className="relative overflow-hidden rounded-lg transition-opacity duration-200">
                    <Video
                      wistiaId={video}
                      controls
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-2 right-2 rounded-full bg-neutral-400/60 p-1 cursor-pointer transition-colors z-10"
                      onClick={() => handleVideoClick(index)}
                    >
                      <Icon name="x" color="white" className="size-6" />
                    </div>
                  </div>
                ) : (
                  <div ref={cardRef} className="relative h-[290px]">
                    <img
                      src={thumbnail}
                      alt={name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute bottom-2 right-2 rounded-full bg-neutral-400/60 p-1 cursor-pointer transition-colors z-10"
                      onClick={() => handleVideoClick(index)}
                    >
                      <Icon
                        name="play"
                        color="white"
                        className="ml-[2px] size-6"
                      />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 flex flex-col justify-end w-full h-full bg-gradient-to-t from-black/60 via-black/0 to-transparent from-[-30%] via-[25%]">
                  <div className="flex flex-col gap-4 p-2">
                    <p className="text-white font-bold">{mobileContent}</p>
                    <p className="text-[#C1C7D1] text-xs">
                      {name} / {role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

type VolunteerTestimonialCardType = {
  title: string;
  data: {
    role: string;
    name: string;
    video: string;
    thumbnail: string;
    mobileContent: string;
    content: string;
  };
};

const volunteerTestimonialsData: VolunteerTestimonialCardType[] = [
  {
    title: "What is a Sunday Like 1",
    data: {
      role: "church member",
      name: "John Doe 1",
      video: "vqe38qpt78",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
  {
    title: "What is a Sunday Like 2",
    data: {
      role: "church member",
      name: "John Doe 2",
      video: "vqe38qpt78",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
  {
    title: "What is a Sunday Like 3",
    data: {
      role: "church member",
      name: "John Doe 3",
      video: "vqe38qpt78",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/04190bbd5f3883a9946334abe492f059.webp?image_crop_resized=1280x674",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
];
