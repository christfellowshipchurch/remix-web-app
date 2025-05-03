import { cn } from "~/lib/utils";
import { Icon } from "~/primitives/icon/icon";
import { useRef, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";

export const WhatToExpectDesktopTabs = () => {
  return (
    <Tabs.Root defaultValue={WhatToExpectData[0].title}>
      <Tabs.List>
        {WhatToExpectData.map((item, index) => (
          <Tabs.Trigger key={index} value={item.title}>
            {item.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {WhatToExpectData.map((item, index) => (
        <Tabs.Content key={index} value={item.title}>
          <WhatToExpectDesktopCard data={item.data} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

const WhatToExpectDesktopCard = ({
  data,
}: {
  data: WhatToExpectCard["data"];
}) => {
  const { content, name, role, image } = data;

  return (
    <div className="w-full bg-navy rounded-[8px] text-white py-24 flex justify-between pr-9 2xl:pr-0">
      <div className="flex flex-col gap-12">
        <p className="text-[26px] font-semibold max-w-[600px]">{content}</p>

        <div className="flex flex-col">
          <h4 className="text-[26px] font-semibold">{name}</h4>
          <p className="text-[26px] font-semibold">{role}</p>
        </div>
      </div>

      <div className="absolute right-0">
        <img
          src={image}
          alt={name}
          className="w-[520px] h-[650px] rounded-[12px]"
        />
        <div className="absolute top-5 left-5 rounded-full bg-[#3D3D3D]/50 p-2">
          <div className="relative -right-[2px]">
            <Icon name="play" color="white" size={42} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatToExpectMobileScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
          {WhatToExpectData.map((item, index) => (
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
              <img
                src={item.data.image}
                alt={item.data.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 flex flex-col justify-end w-full h-full bg-gradient-to-t from-black/60 via-black/0 to-transparent from-[-30%] via-[25%]">
                <div className="flex flex-col gap-4 p-2">
                  <p className="text-white font-bold">
                    {item.data.mobileContent}
                  </p>

                  <p className="text-[#C1C7D1] text-xs">
                    {item.data.name} / {item.data.role}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-[10px] right-[10px] rounded-full bg-[#3D3D3D]/50 p-1">
                <div className="relative -right-[2px]">
                  <Icon name="play" color="white" />
                </div>
              </div>
            </div>
          ))}
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
    image: string;
    mobileContent: string;
    content: string;
  };
};

const WhatToExpectData: WhatToExpectCard[] = [
  {
    title: "What is a Sunday Like",
    data: {
      role: "church member",
      name: "John Doe",
      image: "/assets/images/home/wte-place-holder.jpg",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
  {
    title: "What is a Sunday Like",
    data: {
      role: "church member",
      name: "John Doe",
      image: "/assets/images/home/wte-place-holder.jpg",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
  {
    title: "What is a Sunday Like",
    data: {
      role: "church member",
      name: "John Doe",
      image: "/assets/images/home/wte-place-holder.jpg",
      mobileContent:
        "“It's given me a lot of peace and clarity around my church.”",
      content:
        "“As a devoted member of the community, I have witnessed countless blessings through our church. The support and love from fellow members have uplifted my spirit during challenging times. I am grateful”",
    },
  },
];
