import { icons } from "~/lib/icons";
import Icon from "~/primitives/icon";

export const FeaturedVerse = () => {
  return (
    <div className="flex flex-col items-center py-8 md:py-16 gap-18 md:gap-16 w-full">
      {/* Cards */}
      <div className="flex gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 bg-[#F4F2F5] rounded-[14px] w-[72px] h-[62px] md:w-[93px] md:h-[82px] p-[10px] md:p-[1rem]"
          >
            <Icon name={card.icon} size={24} className="text-black" />
            <p className="text-[10px] font-extrabold text-black">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Verse */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium text-text-secondary">John 3:16</h3>
        <p className="font-[merriweather] text-center">
          "For God so loved the world that he gave his only Son, that whoever
          believes in him should not perish but have eternal life".
        </p>
      </div>
    </div>
  );
};

const cards: { icon: keyof typeof icons; title: string }[] = [
  {
    icon: "handsPraying",
    title: "Prayer",
  },
  {
    icon: "appleLogo",
    title: "I Said Yes",
  },
  {
    icon: "plug",
    title: "Connect",
  },
  {
    icon: "donateHeart",
    title: "Giving",
  },
];
