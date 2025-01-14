import { Link, useLoaderData } from "react-router";

import { LoaderReturnType } from "../loader";
import heroBgImgStyles from "~/styles/heroBgImageStyles";

export const ThisWeek = () => {
  const { thisWeek } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col items-center gap-12 bg-[#F5F5F7] px-8 pt-20 pb-12 lg:pt-28">
      <h2 className="text-center text-4xl font-bold text-navy lg:text-start lg:text-[2.5rem]">
        This Week
      </h2>
      {/* Big Card */}
      <div className="lg:max-w-[1080px] w-full xl:max-w-[1240px] flex flex-col">
        <BigCard card={thisWeek?.cards[0]} />
        {/* Grid of Smaller Cards */}
        <div className="grid grid-cols-4 md:gap-4 w-full">
          {thisWeek?.cards.slice(1).map((card, index) => (
            <SmallCard key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export type ThisWeekCard = {
  title: string;
  description: string;
  image: string;
  url: string;
};

const BigCard = ({ card }: { card: ThisWeekCard }) => {
  return (
    <Link
      prefetch="viewport"
      to={card.url}
      className="mb-4 relative flex col-span-4 h-64 md:h-80 lg:h-[440px] xl:h-[480px] w-[90vw] lg:w-full transition-transform duration-300 rounded-md hover:scale-[1.02]"
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.2),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        ...heroBgImgStyles(card.image),
      }}
    >
      <div className="absolute size-full bg-black bg-opacity-20" />
      <div className="flex flex-col absolute self-end p-4 text-white ">
        <h3 className="font-bold text-2xl">{card.title}</h3>
        <p>{card.description}</p>
      </div>
    </Link>
  );
};

const SmallCard = ({ card }: { card: ThisWeekCard }) => {
  return (
    <Link
      prefetch="intent"
      to={card.url}
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.2),0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      className="flex col-span-4 md:col-span-2 bg-white overflow-hidden w-[90vw] lg:w-full md:h-24 lg:h-28 mb-4 transition-transform duration-300 hover:scale-[1.02] rounded-md gap-4"
    >
      <img src={card.image} className="h-full w-40 lg:w-44" />
      <div className="flex flex-col justify-center gap-1 py-2 pr-4 ">
        <h3 className="font-bold text-xl">{card.title}</h3>
        <p className="text-[#818181] text-sm">{card.description}</p>
      </div>
    </Link>
  );
};
