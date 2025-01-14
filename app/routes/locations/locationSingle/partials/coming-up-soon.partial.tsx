import { Link, useLoaderData } from "react-router";
import Button from "~/primitives/button";
import { LoaderReturnType } from "../loader";
import heroBgImgStyles from "~/styles/heroBgImageStyles";

export const ComingUpSoon = () => {
  const { comingUpSoon } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex w-full flex-col items-start py-10 md:py-16 lg:py-20 xl:py-24 gap-12 lg:items-center">
      <h2 className="heading-h3 w-full text-center text-navy">
        {comingUpSoon?.title}
      </h2>

      <div className="flex gap-4 overflow-x-auto max-w-full lg:justify-center lg:items-center lg:w-full lg:overflow-visible lg:max-w-[1440px]">
        {comingUpSoon?.cards?.map((card, index) => (
          <div key={index}></div>
          // <Link
          //   to={card.url}
          //   prefetch="intent"
          //   key={index}
          //   style={{
          //     boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.25)",
          //     marginLeft: index === 0 ? 16 : 0,
          //     marginRight: index === comingUpSoon.cards.length - 1 ? 16 : 0,
          //     ...heroBgImgStyles(card.image),
          //   }}
          //   className="w-[90vw] lg:w-[370px] h-[450px] rounded-md flex items-center relative transition-transform duration-300 hover:-translate-y-3 shrink-0"
          // >
          //   <div
          //     className="absolute size-full opacity-80"
          //     style={{
          //       background:
          //         "linear-gradient(to bottom, rgba(0, 0, 0, 0), #353535)",
          //     }}
          //   />
          //   <div className="absolute self-end text-white p-5">
          //     <h2 className="font-bold text-xl">{card.title}</h2>
          //     <p>{card.description}</p>
          //   </div>
          // </Link>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <Button href={comingUpSoon?.buttonUrl} intent="secondary" size="md">
          {comingUpSoon?.buttonTitle}
        </Button>
      </div>
    </div>
  );
};
