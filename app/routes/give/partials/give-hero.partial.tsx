import { useLoaderData } from "react-router";

import { LoaderReturnType } from "../loader";
import { PushpayGiving } from "~/components/pushpay-giving";

export const GiveHero = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full py-29 content-padding bg-[url('/assets/images/give/hero-bg-mobile.jpg')] md:bg-[url('/assets/images/give/hero-bg.jpg')] bg-cover bg-right-bottom">
      <div className="flex flex-col md:flex-row gap-22 md:gap-16 w-full max-w-[1010px] mx-auto">
        <div className="w-full md:w-3/5 flex relative">
          <h1 className="text-center md:text-left text-[32px] md:text-[52px] lg:text-[62px] xl:text-[72px] font-extrabold text-white leading-tight relative z-2">
            Your generosity makes a difference!
          </h1>

          {/* Floating Images */}
          <img
            src="/assets/images/give/float-1.png"
            alt="Floating Image 1"
            className="absolute hidden 2xl:block top-32 2xl:-left-58 3xl:-left-64 rotate-[-5.5deg] size-[216px] rounded-[10px]"
          />
          <img
            src="/assets/images/give/float-1.png"
            alt="Floating Image 2"
            className="absolute -bottom-4 left-14 rotate-[9.6deg] w-[155px] h-[198px] rounded-[5px]"
          />
          <img
            src="/assets/images/give/float-1.png"
            alt="Floating Image 3"
            className="absolute bottom-14 left-80 rotate-[-5.5deg] w-[177px] h-[171px] rounded-[7px]"
          />
        </div>

        <div className="w-full md:w-2/5 flex flex-1">
          <PushpayGiving campusList={data?.campusList || []} />
        </div>
      </div>
    </div>
  );
};
