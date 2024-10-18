import { Link, useLoaderData } from "@remix-run/react";
import Button from "~/primitives/button";
import { whatToExpectData } from "../locations-single.data";
import { camelCase, startCase } from "lodash";
import { LoaderReturnType } from "../loader";
import Modal from "~/primitives/Modal";
import { WhatToExpectModal } from "~/components/modals/what-to-expect";

/**
 * this will include the following:
 * - What to expect
 * - During the Week
 * - Ways to Join Online(Cf Everywhere)
 */

export function MainCampusInfo() {
  const { name, url } = useLoaderData<LoaderReturnType>();
  const camelCaseName = camelCase(name) as
    | "palmBeachGardens"
    | "portStLucie"
    | "royalPalmBeach"
    | "boyntonBeach"
    | "stuart"
    | "okeechobee"
    | "belleGlade"
    | "veroBeach"
    | "westlake"
    | "trinity"
    | "cfe";

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-[1240px] flex-col gap-10 pb-16 lg:pb-24 lg:pl-6 lg:pt-10 xl:pl-4">
        {!url?.includes("cf-everywhere") && (
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
        {url === "cf-everywhere" && (
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
            {!url?.includes("cf-everywhere") && (
              <div className="flex cursor-pointer items-center gap-2">
                <Modal>
                  <Modal.Button>
                    <div className="flex gap-2">
                      <div className="font-bold italic text-primary underline">
                        See what to expect here!
                      </div>
                      <img
                        src="/icons/blue-play.svg"
                        alt="play"
                        width={24}
                        height={24}
                      />
                    </div>
                  </Modal.Button>
                  <Modal.Content title="What to Expect">
                    {/* Add Wisita Video */}
                    <WhatToExpectModal
                      name={name?.includes("iglesia") ? "cfe" : camelCaseName}
                    />
                  </Modal.Content>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * We need to separate this section for mobile to it will appear above the PastorCard
 */
export function WaysToJoinOnlineMobile() {
  return (
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
  );
}
