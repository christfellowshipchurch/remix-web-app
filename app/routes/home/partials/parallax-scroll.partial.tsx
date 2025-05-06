import { cn } from "~/lib/utils";
import { IconButton } from "~/primitives/button/icon-button.primitive";

export default function SplitScrollLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Sticky stack */}
      <div className="w-1/2 relative">
        {contentData.map((item, index) => (
          <div key={index} className="h-screen">
            <div
              className={cn(
                "sticky",
                index !== 0 ? "top-1/2" : "top-1/3",
                index !== 0 && "-translate-y-1/2",
                index === 0 && "mb-32",
                "p-6",
                "text-xl",
                "z-10"
              )}
            >
              <img
                src={item.image}
                alt={item.description}
                className="max-w-[390px] max-h-[340px] mx-auto"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  aspectRatio: item.aspectRatio || "600 / 530",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Right: Scrolling content */}
      <div className="w-1/2 space-y-12 p-8 overflow-auto">
        {contentData.map((item, index) => (
          <div key={index} className="h-screen bg-white p-4">
            <div
              className={cn(
                "flex",
                "flex-col",
                "justify-center",
                index !== contentData.length - 1 && "pb-[600px]",
                "gap-4",
                "lg:gap-8",
                "h-full"
              )}
            >
              <div className="flex flex-col">
                <h3
                  className="text-2xl font-bold text-center md:text-left"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="text-center md:text-left">{item.description}</p>
              </div>
              <div className="hidden md:block">
                <IconButton
                  to={item.url}
                  withRotatingArrow
                  className="rounded-full hover:!text-ocean"
                >
                  Learn More
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParallaxScroll() {
  return (
    <section className="md:px-12 lg:px-18 w-full">
      <div className="max-w-content-padding mx-auto w-full">
        {/* Mobile Title */}
        <h2 className="text-4xl font-bold w-full text-center sticky top-0 md:hidden pb-8 bg-white">
          Think of it less as a chore and more{" "}
          <br className="hidden md:block lg:hidden" />
          as... <span className="text-ocean">a chance.</span>
        </h2>

        <div className="w-full flex flex-col gap-8 md:gap-0 lg:gap-4">
          <h2 className="text-4xl font-bold w-full text-center hidden md:block mb-32">
            Think of it less as a chore and more{" "}
            <br className="hidden md:block lg:hidden" />
            as... <span className="text-ocean">a chance.</span>
          </h2>

          <SplitScrollLayout />
        </div>
      </div>
    </section>
  );
}

const contentData: {
  title: string;
  image: string;
  description: string;
  url: string;
  aspectRatio?: string;
}[] = [
  {
    title: `<span className="font-bold">To connect</span> with other people`,
    image: "/assets/images/home/parallax-scroll-1.webp",
    description:
      " Looking for community? A place where you can find genuine connection with other people. A place where you're not just a face in the crowd, but someone who belongs. ",
    url: "/connect",
  },
  {
    title: `<span className="font-bold">To hit pause</span> on the chaos of everyday life`,
    image: "/assets/images/home/parallax-scroll-2.webp",
    description:
      "Searching for some kind of peace or purpose? Life can throw some curveballs, and sometimes you need a place to reflect, recharge, and find some perspective. ",
    url: "/connect",
    aspectRatio: "600 / 400",
  },
  {
    title: `<span className="font-bold">To hear a story,</span> to sing a song, to be reminded of hope.`,
    image: "/assets/images/home/parallax-scroll-3.webp",
    description:
      "Sing some songs, hear a good story, and be reminded that there is still good in the world. ",
    url: "/connect",
  },
];
