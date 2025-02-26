import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";

export default function ServiceTimes() {
  const { url, serviceTimes, additionalInfo } =
    useLoaderData<LoaderReturnType>();
  let title = "Every Sunday";
  if (url.includes("iglesia")) {
    title = "Cada Domingo";
  } else if (url === "cf-everywhere") {
    title = "Live Every Sunday";
  }

  return (
    <div className="flex justify-center bg-gradient-to-br from-navy to-ocean text-white">
      <div className="relative flex w-full max-w-[1240px] flex-col items-center gap-1 py-3 md:pl-6 lg:flex-row lg:gap-4 xl:gap-6 xl:pl-4">
        <div className="mb-2 flex flex-col justify-center md:pr-2 lg:mb-0 lg:gap-0 xl:pr-8">
          <h2 className="text-2xl font-bold">
            {/* TODO: If there are other service days, map those too?? */}
            {title}
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
        <div className="hidden text-2xl font-bold lg:flex  xl:text-3xl">
          {serviceTimes.map((time, index) => (
            <div key={index} className="flex ">
              {time?.hour?.map((hour, index) => (
                <p
                  key={index}
                  className="border-l py-2 px-6 border-white/20 xl:border-l-2"
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
        <p className="w-full pt-1 text-center text-sm lg:hidden flex flex-col gap-2">
          {additionalInfo?.map((info, index) => (
            <span key={index}>*{info}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
