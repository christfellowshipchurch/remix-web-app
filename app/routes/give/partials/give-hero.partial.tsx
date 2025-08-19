import { useLoaderData } from "react-router";

import { LoaderReturnType } from "../loader";
import { PushpayGiving } from "~/components/pushpay-giving";

export const GiveHero = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full pb-20 pt-32 md:pt-40 lg:py-29 content-padding bg-[url('/assets/images/give/hero-bg-mobile.jpg')] md:bg-[url('/assets/images/give/hero-bg.jpg')] bg-cover bg-right-bottom">
      <div className="flex flex-col lg:flex-row gap-28 md:gap-40 lg:gap-16 w-full max-w-[1010px] mx-auto">
        <div className="w-full lg:w-3/5 flex relative">
          <h1 className="text-center lg:text-left text-[32px] md:text-[52px] lg:text-[62px] xl:text-[72px] font-extrabold text-white leading-tight relative z-2 mx-auto max-w-[520px]">
            Your generosity makes a difference!
          </h1>

          {/* Floating Images */}
          <img
            src="/assets/images/give/float-1.png"
            alt="Floating Image 1"
            className="absolute left-0 lg:hidden 2xl:block top-22 md:top-34 lg:top-32 xl:-left-58 3xl:-left-64 rotate-[-5.5deg] size-[90px] md:size-[150px] lg:size-[216px] rounded-[10px]"
          />
          <img
            src="/assets/images/give/float-2.png"
            alt="Floating Image 2"
            className="absolute -top-30 left-12 md:-top-40 lg:-bottom-4 lg:!top-auto lg:left-14 rotate-[9.6deg] w-[90px] md:w-[120px] lg:w-[155px] aspect-[155/198] rounded-[5px]"
          />
          <img
            src="/assets/images/give/float-3.png"
            alt="Floating Image 3"
            className="absolute -top-26 right-4 md:-top-32 md:right-12 lg:bottom-14 lg:right-auto lg:top-auto lg:left-80 rotate-[-5.5deg] w-[105px] md:w-[136px] lg:w-[177px] aspect-[177/171] rounded-[7px]"
          />
        </div>

        <div className="w-full lg:w-2/5 flex flex-1">
          <PushpayGiving campusList={data?.campusList || []} />
        </div>
      </div>
    </div>
  );
};
