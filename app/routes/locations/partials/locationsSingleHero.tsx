import { find, startCase } from "lodash";
import { headerData, whatToExpectData } from "./locationsSingleData";
import Button from "~/primitives/Button";
import { Link } from "@remix-run/react";
import { PastorCard } from "./pastorCard";

export type Location = {
  name: string;
};

export const LocationsHero = ({ name }: Location) => {
  const headerContent = find(headerData, { name: name });
  return (
    <div className="w-full">
      {/* Background Video */}
      <div className="relative h-[780px] w-full">
        <video
          src={
            headerContent?.backgroundVideo?.desktop ||
            "https://embed.wistia.com/deliveries/d7da7955aeaabad13c81b0d28eb0a906.mp4"
          }
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-0 top-0 size-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute size-full bg-[rgba(0,0,0,0.5)]" />

        {/* Hero Content */}
        <div className="absolute top-0 flex size-full flex-col justify-between gap-4 px-4 py-8 text-white md:top-[40%] md:h-auto md:w-full md:justify-start md:px-6 lg:px-10 xl:left-1/2 xl:top-1/2 xl:w-screen xl:max-w-[1240px] xl:-translate-x-1/2 xl:-translate-y-1/2">
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold md:text-6xl">
              Christ Fellowship Church <br className="hidden md:block" /> in{" "}
              <br className="md:hidden" />
              {name}
            </h1>
            <p className="mt-2 max-w-[320px] text-[20px] font-semibold md:max-w-none">
              A church that wants to help you live the life you were created
              for.
            </p>
          </div>
          <div className="w-3/5 md:mt-12 md:border-t md:border-[#E7E7E7]" />
          <div className="flex w-full flex-col gap-4 md:flex-row md:pt-6">
            {/* Add on Clicks */}
            <Button
              href="#set-a-reminder"
              intent="primary"
              className="w-full rounded-xl"
            >
              Set a Reminder
            </Button>
            <Button intent="white" className="rounded-xl border-0">
              Get Connected
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-gradient-to-br from-newsletter_to to-primary py-4 text-white">
        <div className="relative flex w-full max-w-[1240px] flex-col items-center gap-1 md:py-2 md:pl-6 lg:flex-row lg:gap-4 xl:gap-6 xl:pl-4">
          <div className="mb-2 flex flex-col justify-center md:pr-2 lg:mb-0 lg:gap-0 xl:pr-8">
            <h2 className="text-2xl font-bold">Every Sunday</h2>
            <p className="hidden max-w-[18vw] text-sm lg:block xl:max-w-[600px]">
              *Kids services take place at each service <br />
              *Traducciones al español ofrecidas a las 11:45am
            </p>
          </div>
          {/* Desktop */}
          <div className="hidden gap-3 py-8 text-2xl font-bold lg:flex xl:py-12 xl:text-3xl">
            <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
              8:30 AM
            </p>
            <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
              10AM
            </p>
            <p className="border-l border-white/20 pl-4 pr-[17px] xl:border-l-2">
              11:45 AM
            </p>
          </div>
          {/* Mobile */}
          <div className="flex gap-3 border-y border-white/20 py-3 text-2xl font-bold lg:hidden xl:text-3xl">
            <p className="border-r border-white/20 pl-4 pr-[17px]">8:30 AM</p>
            <p className="border-r border-white/20 pl-4 pr-[17px]">10AM</p>
            <p className="pl-4">11:45 AM</p>
          </div>
          <p className="w-full text-center text-sm lg:hidden">
            *Kids services take place at each service <br />
            *Traducciones al español ofrecidas a las 11:45am
          </p>
        </div>
      </div>
      {/* TODO: Pass Data */}
      {name === "cf-everywhere" && (
        <div className="flex flex-col items-center gap-4 pb-12 pt-5 text-center lg:hidden lg:flex-row lg:items-start lg:border-0 lg:text-start">
          <h3 className="pt-3 text-lg font-bold text-wordOfChrist md:text-2xl lg:w-36 lg:pt-0">
            Ways to Join Online
          </h3>
          <div className="flex gap-4 px-4">
            {/* TODO: Figure out Icons -> Already have but need to change the fill */}
            <Button
              href="https://www.youtube.com/c/ChristFellowshipWelcomeHome"
              intent="secondary"
              className="flex items-center justify-center"
              size="md"
            >
              Youtube
            </Button>
            <Button
              href="https://www.facebook.com/CFimpact/"
              intent="primary"
              className="flex items-center justify-center"
              size="md"
            >
              Facebook Live
            </Button>
          </div>
        </div>
      )}
      <div className="flex w-full flex-col items-center">
        <PastorCard name={name} />
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-[1240px] flex-col gap-10 pb-16 lg:pb-32 lg:pl-6 lg:pt-10 xl:pl-4">
          {!name?.includes("cf-everywhere") && (
            <div className="my-8 flex flex-col items-center gap-4 text-center lg:mt-0 lg:flex-row lg:items-start lg:gap-5 lg:text-start xl:gap-6">
              <div className="mx-auto w-4/5 border-t border-[#cecece] lg:hidden" />
              <h3 className="mt-12 text-[1.375rem] font-bold text-wordOfChrist md:text-2xl lg:mt-0 lg:w-36">
                During the Week
              </h3>
              <div className="flex flex-col gap-10 lg:flex-row xl:gap-14">
                <div className="flex flex-col">
                  <h4 className="text-[20px] font-bold">Tuesday</h4>
                  <div className="flex items-center">
                    <p>6:15 PM - Kids University </p>
                    <Link to="#share" className="pl-1">
                      <img
                        src="/icons/share.svg"
                        alt="share"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <p>6:15 PM - Kids University </p>
                    <Link to="#share" className="pl-1">
                      <img
                        src="/icons/share.svg"
                        alt="share"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <p>6:15 PM - Kids University </p>
                    <Link to="#share" className="pl-1">
                      <img
                        src="/icons/share.svg"
                        alt="share"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[20px] font-bold">Wednesday</h4>
                  <div className="flex items-center">
                    <p>6:15 PM - Kids University </p>
                    <Link to="#share" className="pl-1">
                      <img
                        src="/icons/share.svg"
                        alt="share"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <p>6:15 PM - Kids University </p>
                    <Link to="#share" className="pl-1">
                      <img
                        src="/icons/share.svg"
                        alt="share"
                        width={12}
                        height={12}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {name === "cf-everywhere" && (
            <div className="hidden flex-col items-center gap-4 text-center lg:flex lg:flex-row lg:items-start lg:gap-5 lg:border-0 lg:text-start">
              <h3 className="pt-3 text-lg font-bold text-wordOfChrist md:text-2xl lg:w-36 lg:pt-0">
                Ways to Join Online
              </h3>
              <div className="flex gap-4 px-4">
                {/* TODO: Figure out Icons -> Already have but need to change the fill */}
                <Button
                  href="https://www.youtube.com/c/ChristFellowshipWelcomeHome"
                  intent="secondary"
                  className="flex items-center justify-center"
                  size="md"
                >
                  Youtube
                </Button>
                <Button
                  href="https://www.facebook.com/CFimpact/"
                  intent="primary"
                  className="flex items-center justify-center"
                  size="md"
                >
                  Facebook Live
                </Button>
              </div>
            </div>
          )}
          <div className="mx-auto w-4/5 border-t border-[#cecece] lg:hidden" />
          <div className="flex flex-col items-center gap-1 text-center lg:flex-row lg:items-start lg:gap-5 lg:border-0 lg:text-start">
            <h3 className="mt-8 text-[1.375rem] font-bold text-wordOfChrist md:text-2xl lg:mt-0 lg:w-36">
              What to expect
            </h3>
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <p className="px-4 md:max-w-[420px] lg:w-[42vw] lg:max-w-[600px] lg:px-0 xl:w-auto xl:max-w-[650px]">
                {whatToExpectData(startCase(name))?.htmlContent}
              </p>
              {/* TODO: Add onClick */}
              {!name?.includes("cf-everywhere") && (
                <div className="flex cursor-pointer items-center gap-2">
                  <div className="font-bold italic text-primary underline">
                    See what to expect here!{" "}
                  </div>
                  <img
                    src="/icons/blue-play.svg"
                    alt="play"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
