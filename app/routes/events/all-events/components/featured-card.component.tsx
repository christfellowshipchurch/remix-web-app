import { Link } from "react-router";
import { FeaturedCardMobile } from "./featured-card-mobile.component";
import { Event } from "../loader";

export const FeaturedCard = ({ card }: { card: Event }) => {
  return (
    <>
      {/* Mobile version */}
      <div className="md:hidden">
        <FeaturedCardMobile card={card} />
      </div>

      {/* Desktop version */}
      <div className="hidden md:block">
        <div
          className="relative w-[90vw] aspect-video md:w-full max-w-[1440px] inset-0 bg-cover bg-center object-cover rounded-lg"
          style={{
            backgroundImage: `url(${card.image})`,
          }}
        >
          <div className="absolute w-[67.5%] xl:w-[70%] right-0 bottom-0 bg-white flex flex-col justify-start gap-6 pl-12 pt-12 xl:pl-16 xl:pt-16 pb-4 rounded-tl-lg">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-[16px] text-text-secondary">
                HAPPENING AT ALL CAMPUS LOCATIONS
              </h2>
              <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
            </div>
            <div className="flex flex-col gap-2 pr-12 xl:pr-16">
              <h3 className="font-bold text-[24px]">{card.title}</h3>
              <p className="font-normal text-text-secondary">
                {card.attributeValues.summary.value}
              </p>
              <Link
                to={`/events/${card.attributeValues.url.value}`}
                prefetch="intent"
                className="underline font-bold cursor-pointer"
              >
                <span className="hover:text-ocean underline">Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
