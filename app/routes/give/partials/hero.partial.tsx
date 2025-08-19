import { useLoaderData } from "react-router";

import { LoaderReturnType } from "../loader";
import { PushpayGiving } from "~/components/pushpay-giving";

export const Hero = () => {
  const data = useLoaderData<LoaderReturnType>();

  return (
    <div className="w-full py-29 content-padding bg-[url('/assets/images/give/hero-bg-mobile.jpg')] md:bg-[url('/assets/images/give/hero-bg.jpg')] bg-cover bg-right-bottom">
      <div className="flex flex-col md:flex-row gap-22 md:gap-16 w-full max-w-[1010px] mx-auto">
        <div className="w-full md:w-3/5 flex relative">
          <h1 className="text-center md:text-left text-[32px] md:text-[52px] lg:text-[72px] font-extrabold text-white leading-tight">
            Your generosity makes a difference!
          </h1>
          {/* TODO: Floating Images */}
        </div>

        <div className="w-full md:w-2/5 flex flex-1">
          <PushpayGiving campusList={data?.campusList || []} />
        </div>
      </div>
    </div>
  );
};
