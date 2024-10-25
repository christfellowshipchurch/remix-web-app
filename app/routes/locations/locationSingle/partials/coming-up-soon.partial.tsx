import { Link, useLoaderData } from "@remix-run/react";
import Button from "~/primitives/button";
import { LoaderReturnType } from "../loader";
import { heroBgImgStyles } from "~/lib/utils";

export const ComingUpSoon = () => {
  const { comingUpSoon } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex w-full flex-col items-center py-10 md:py-16 lg:py-20 xl:py-24 gap-12">
      <h1 className="text-3xl font-bold text-secondary">
        {comingUpSoon?.title}
      </h1>
      <div className="flex gap-4 justify-start lg:justify-center overflow-scroll w-[100vw] lg:overflow-visible lg:max-w-[1440px]">
        {comingUpSoon?.cards?.map((card, index) => (
          <Link
            to={card.url}
            key={index}
            style={{
              marginLeft: index === 0 ? 16 : 0,
              marginRight: index === comingUpSoon.cards.length - 1 ? 16 : 0,
              ...heroBgImgStyles(card.image),
            }}
            className="w-[90vw] lg:w-[370px] h-[450px] rounded-md flex items-center relative transition-transform duration-300 hover:-translate-y-3"
          >
            <div
              className="absolute size-full opacity-80"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), #353535)",
              }}
            />
            <div className="absolute self-end text-white p-5">
              <h2 className="font-bold text-xl">{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <Button href="/events" intent="secondary" size="md">
        {comingUpSoon?.buttonTitle}
      </Button>
    </div>
  );
};
