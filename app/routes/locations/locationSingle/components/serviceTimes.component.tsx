import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export default function ServiceTimes() {
  const { url, serviceTimes, additionalInfo } =
    useLoaderData<LoaderReturnType>();

  return (
    <div className="flex justify-center bg-gradient-to-br from-newsletter_to to-primary py-4 text-white">
      <div className="relative flex w-full max-w-[1240px] flex-col items-center gap-1 md:py-2 md:pl-6 lg:flex-row lg:gap-4 xl:gap-6 xl:pl-4">
        <div className="mb-2 flex flex-col justify-center md:pr-2 lg:mb-0 lg:gap-0 xl:pr-8">
          <h2 className="text-2xl font-bold">
            {/* TODO: If other days map those too?? */}
            {url !== "cf-everywhere" ? `Every Sunday` : `Live Every Sunday`}
          </h2>
          <p className="hidden max-w-[18vw] text-sm lg:block xl:max-w-[600px]">
            {additionalInfo?.map((info, index) => (
              <span key={index}>
                *{info}
                <br />
              </span>
            ))}
          </p>
        </div>
        {/* Desktop */}
        <div className="hidden gap-3 py-8 text-2xl font-bold lg:flex xl:py-12 xl:text-3xl">
          {serviceTimes.map((time, index) => (
            <div key={index} className="flex ">
              {time?.hour?.map((hour, index) => (
                <p
                  key={index}
                  className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2"
                >
                  {hour}
                </p>
              ))}
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="flex gap-3 border-y border-white/20 py-3 text-2xl font-bold lg:hidden xl:text-3xl">
          {serviceTimes.map((time, index) => (
            <div key={index} className="flex ">
              {time?.hour?.map((hour, index) => (
                <p
                  key={index}
                  className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2"
                >
                  {hour}
                </p>
              ))}
            </div>
          ))}
        </div>
        <p className="w-full text-center text-sm lg:hidden">
          {additionalInfo?.map((info, index) => (
            <span key={index}>
              *{info}
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
