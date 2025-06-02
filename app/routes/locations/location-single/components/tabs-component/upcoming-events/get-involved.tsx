import { useState } from "react";
import { SectionTitle } from "~/components/section-title";
import { useResponsive } from "~/hooks/use-responsive";
import { cn } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import {
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/primitives/shadcn-primitives/carousel";
import { Carousel } from "~/primitives/shadcn-primitives/carousel";
import { Link } from "react-router";
import Icon from "~/primitives/icon";

const items = [
  {
    title: "Volunteer with Others",
    image: "/assets/images/locations/volunteer.jpg",
    cta: {
      label: "Learn More",
      url: "/",
    },
  },
  {
    title: "Join a Group",
    image: "/assets/images/locations/group.jpg",
    cta: {
      label: "Find Now",
      url: "/group-finder",
    },
  },
  {
    title: "Take a Class",
    image: "/assets/images/locations/class.jpg",
    cta: {
      label: "Find Now",
      url: "/group-finder",
    },
  },
];

export const GetInvolved = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMedium, isXXLarge } = useResponsive();

  const itemsLength = items.length;
  let itemsPerSlide = 1;
  let showDots = itemsLength > 1;
  if (isMedium) {
    itemsPerSlide = 2;
    showDots = itemsLength > 2;
  } else if (isXXLarge) {
    itemsPerSlide = 3;
    showDots = itemsLength > 3;
  }

  const slides = itemsLength - itemsPerSlide + 1;

  return (
    <div
      style={{ backgroundColor: "#00354D" }}
      className={cn(
        "w-full py-28 content-padding flex items-center justify-center",
        'bg-[url("/assets/images/locations/bg-logo.png")]',
        "bg-[top_0px_left_0px] bg-no-repeat bg-[length:70%] md:bg-[length:35%] xl:bg-[length:25%]"
      )}
    >
      <div className="w-full flex flex-col gap-16 md:gap-28 max-w-screen-content">
        <div className="flex flex-col gap-2">
          <div className="hidden md:block">
            <SectionTitle
              sectionTitle="next steps"
              className="text-white"
              color="white"
            />
          </div>
          <div className="block md:hidden">
            <SectionTitle sectionTitle="next steps" />
          </div>
          <h2 className="font-extrabold text-white text-[40px] md:text-[52px]">
            Get Involved
          </h2>
        </div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative"
        >
          <CarouselContent className="gap-6">
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className="w-full basis-[85%] sm:basis-[46%] lg:basis-auto max-w-[420px] pl-0 flex flex-col items-stretch"
                style={{
                  paddingRight:
                    index === itemsLength - 1 && itemsLength > 1
                      ? "24px"
                      : "0px",
                }}
              >
                <GetInvolvedCard
                  title={item.title}
                  image={item.image}
                  cta={item.cta}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between w-full absolute -bottom-8">
            {/* Dots */}
            {showDots && (
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(slides) }, (_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-neutral-lighter"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Arrows */}
            {showDots && (
              <CarouselArrows
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                itemsLength={itemsLength}
              />
            )}
          </div>
        </Carousel>
      </div>
    </div>
  );
};

const CarouselArrows = ({
  currentSlide,
  setCurrentSlide,
  itemsLength,
}: {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  itemsLength: number;
}) => {
  return (
    <div className="flex gap-4">
      <div
        onClick={() =>
          setCurrentSlide(currentSlide !== 0 ? currentSlide - 1 : 0)
        }
      >
        <CarouselPrevious
          className="right-16 left-auto border-white disabled:border-[#AAAAAA]"
          fill="white"
          disabledFill="#AAAAAA"
        />
      </div>
      <div
        onClick={() =>
          setCurrentSlide(
            currentSlide !== itemsLength - 1
              ? currentSlide + 1
              : itemsLength - 1
          )
        }
      >
        <CarouselNext
          className="right-4 border-white disabled:border-[#AAAAAA]"
          fill="white"
          disabledFill="#AAAAAA"
        />
      </div>
    </div>
  );
};

const GetInvolvedCard = ({
  title,
  image,
  cta,
}: {
  title: string;
  image: string;
  cta: {
    label: string;
    url: string;
  };
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-[430px] relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />

        <div className="absolute top-0 left-0 size-full bg-gradient-to-t from-black to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-fit flex flex-col gap-4 p-4 text-white ">
          <div className="flex items-center gap-2">
            <h3 className="text-[37px] font-extrabold leading-tight">
              {title}
            </h3>
            <Icon name="arrowTopRight" color="white" size={39} />
          </div>
          <Link to={cta.url}>
            <Button
              intent="secondary"
              className="border-white text-white transition-all duration-300 hover:!bg-white/10 w-fit rounded-none"
            >
              {cta.label}
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-3 bg-ocean w-full" />
    </div>
  );
};
