import {
  Carousel,
  CarouselArrows,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "~/primitives/shadcn-primitives/carousel";
import { PageBuilderSection } from "../../types";
import { cn } from "~/lib/utils";
import { HTMLRenderer } from "~/primitives/html-renderer/html-renderer.component";

export const ImageGallerySection = ({ data }: { data: PageBuilderSection }) => {
  return (
    <div className="w-full py-12 md:py-28 bg-white pl-5 md:pl-12 lg:px-18">
      <div className="max-w-screen-content mx-auto flex flex-col gap-12 xl:gap-20">
        <div className="flex flex-col gap-5 md:gap-6">
          <h2 className="text-2xl md:text-[52px] font-extrabold text-text-primary">
            {data.name}
          </h2>
          {data?.content?.length > 0 && (
            <HTMLRenderer className="md:text-lg" html={data.content} />
          )}
        </div>

        {/* Gallery Component */}
        <ImageGalleryComponent data={data.imageGallery} />
      </div>
    </div>
  );
};

const ImageGalleryComponent = ({ data }: { data: string[] | undefined }) => {
  if (!data) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <CarouselContent
        className={cn(
          "gap-6 pt-4 aspect-video max-h-[176px]",
          "md:mt-12 md:max-h-[400px]",
          "lg:max-h-[650px]",
          "xl:gap-8",
          "2xl:max-h-[720px]"
        )}
      >
        {data.map((image, index) => (
          <CarouselItem
            key={index}
            className={cn(
              cn(
                "w-full",
                "md:basis-[95%]",
                index !== data.length - 1
                  ? "md:basis-[95%] max-w-[1100px] 2xl:max-w-[1280px]"
                  : "md:basis-[96%] "
              )
            )}
          >
            <img
              src={image}
              alt={image}
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div
        className={cn("w-full relative mt-8 xl:mt-12 pb-8", {
          "lg:mt-6 lg:pb-0": data.length < 4,
        })}
      >
        <div className="absolute h-8 top-4 left-0">
          <CarouselDots
            activeClassName="bg-black"
            inactiveClassName="bg-neutral-lighter"
          />
        </div>

        <div className={cn("absolute h-8 right-24")}>
          <CarouselArrows arrowStyles="text-black border-black hover:text-black hover:border-black bg-transparent" />
        </div>
      </div>
    </Carousel>
  );
};
