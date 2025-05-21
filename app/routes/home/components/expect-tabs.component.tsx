import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { useRef, useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Video } from "~/primitives/video/video.primitive";

export const WhatToExpectDesktopTabs = () => {
  return (
    <Tabs.Root
      defaultValue={WhatToExpectData[0].title}
      className="flex flex-col gap-16 xl:gap-32"
    >
      {WhatToExpectData.map((tab, index) => (
        <Tabs.Content value={tab.title} key={index}>
          <WhatToExpectDesktopCard data={tab.data} />
        </Tabs.Content>
      ))}

      <Tabs.List className="flex gap-8 xl:gap-16 w-full">
        {WhatToExpectData.map((item, index) => (
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
    </Tabs.Root>
  );
};

const WhatToExpectDesktopCard = ({
  data,
}: {
  data: WhatToExpectCard["data"];
}) => {
  const { content, name, role, video } = data;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handlePauseClick = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full bg-navy rounded-l-[16px] 2xl:rounded-r-[16px] text-white pl-12 py-16 xl:py-24 flex justify-between pr-9 2xl:pr-0 relative">
      <div className="flex flex-col gap-12">
        <p className="text-xl xl:text-[26px] font-semibold max-w-[600px]">
          {content}
        </p>

        <div className="flex flex-col">
          <h4 className="text-[21px] font-extrabold leading-none">{name}</h4>
          <p className="text-lg font-bold text-border-secondary">{role}</p>
        </div>
      </div>

      <div className="absolute right-8 xl:right-10 -top-10 xl:-top-20">
        {isPlaying ? (
          <div className="relative overflow-hidden rounded-[12px] transition-opacity duration-200">
            <Video
              wistiaId={video}
              controls
              className="w-[340px] xl:w-[520px] aspect-[520/650] rounded-[12px]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-[12px]" />
            <div
              className="absolute top-5 left-5 rounded-full bg-[#3D3D3D]/50 p-2 cursor-pointer hover:bg-[#3D3D3D]/70 transition-colors"
              onClick={handlePauseClick}
            >
              <div className="relative">
                <Icon name="arrowBack" color="white" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-[340px] xl:w-[520px] aspect-[520/650] rounded-[12px] bg-black relative cursor-pointer group overflow-hidden transition-opacity duration-300"
            onClick={handlePlayClick}
          >
            <img
              src={data.thumbnail}
              alt={name}
              className="w-full h-full object-cover rounded-[12px]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-[12px]" />
            <div
              className="absolute top-5 left-5 rounded-full bg-[#3D3D3D]/50 p-2 cursor-pointer hover:bg-[#3D3D3D]/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick();
              }}
            >
              <div className="relative -right-[2px]">
                <Icon name="play" color="white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WhatToExpectMobileScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="lg:hidden w-full">
      <div className="flex flex-col gap-4 w-full overflow-x-auto pb-2">
        <div
          ref={containerRef}
          className={cn(
            "flex gap-4 flex-nowrap overflow-x-auto pt-2",
            "items-center w-full pb-"
          )}
        >
          {WhatToExpectData.map((item, index) => {
            const { video, mobileContent, name, role } = item.data;

            return (
              <div
                key={index}
                data-card
                className="w-[220px] h-[290px] rounded-[8px] relative flex-shrink-0"
                style={{
                  marginLeft: index === 0 ? "8px" : "0",
                  marginRight:
                    index === WhatToExpectData.length - 1 ? "8px" : "0",
                }}
              >
                <Video
                  wistiaId={video}
                  controls={false}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 flex flex-col justify-end w-full h-full bg-gradient-to-t from-black/60 via-black/0 to-transparent from-[-30%] via-[25%]">
                  <div className="flex flex-col gap-4 p-2">
                    <p className="text-white font-bold">{mobileContent}</p>

                    <p className="text-[#C1C7D1] text-xs">
                      {name} / {role}
                    </p>
                  </div>
                </div>

                {/* Play Button */}
                <div className="absolute bottom-[10px] right-[10px] rounded-full bg-[#3D3D3D]/50 p-1">
                  <div className="relative -right-[2px]">
                    <Icon name="play" color="white" />
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

type WhatToExpectCard = {
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

const WhatToExpectData: WhatToExpectCard[] = [
  {
    title: "What is a Sunday Like 1",
    data: {
      role: "church member",
      name: "John Doe 1",
      video: "7yhe4p60vn",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/142ed1790443bd9226f6b1010aa957d57ba002bc.jpg?image_resize=960",
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
      video: "7yhe4p60vn",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/142ed1790443bd9226f6b1010aa957d57ba002bc.jpg?image_resize=960",
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
      video: "7yhe4p60vn",
      thumbnail:
        "https://embed-ssl.wistia.com/deliveries/142ed1790443bd9226f6b1010aa957d57ba002bc.jpg?image_resize=960",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
];
