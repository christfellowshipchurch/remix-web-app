import { Link, useLoaderData } from "@remix-run/react";
import Button from "~/primitives/button";
import { whatToExpectData } from "../locations-single.data";
import { camelCase, startCase } from "lodash";
import { LoaderReturnType } from "../loader";
import Modal from "~/primitives/Modal";
import WhatToExpectModal from "~/components/modals/what-to-expect";
import { weekdaySpanishTranslation } from "../util";
import Icon from "~/primitives/icon";
import { useState } from "react";

/**
 * This file will include the following:
 * - What to expect
 * - During the Week
 * - Ways to Join Online(Cf Everywhere)
 * - Tenemos más para ti (CFE Only Section)
 */

export function MainCampusInfo() {
  const { name } = useLoaderData<LoaderReturnType>();

  const expectData = whatToExpectData(startCase(name));
  const isEspanol = name?.includes("Español");
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
        {name !== "Online (CF Everywhere)" && <DuringTheWeek />}
        {name === "Online (CF Everywhere)" && <WaysToJoinOnlineDesktop />}
        <div className="mx-auto w-4/5 border-t border-[#cecece] lg:hidden" />
        <div className="flex flex-col items-center gap-1 text-center lg:flex-row lg:items-start lg:gap-5 lg:border-0 lg:text-start">
          <h3 className="mt-8 text-[1.375rem] font-bold text-navy md:text-2xl lg:mt-0 lg:w-36">
            {expectData?.title}
          </h3>
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <p className="px-4 md:max-w-[420px] lg:w-[42vw] lg:max-w-[600px] lg:px-0 xl:w-auto xl:max-w-[650px]">
              {expectData?.htmlContent}
            </p>
            {name !== "Online (CF Everywhere)" && (
              <div className="flex cursor-pointer items-center gap-2">
                <Modal>
                  <Modal.Button>
                    <div className="flex gap-2">
                      <div className="font-bold italic text-primary underline">
                        {expectData?.linkTitle}
                      </div>
                      <Icon size={24} name="circlePlay" color="#0092bc" />
                    </div>
                  </Modal.Button>
                  <Modal.Content
                    title={`${
                      isEspanol ? "¿Qué puedo esperar?" : "What to Expect"
                    }`}
                  >
                    {/* Add Wisita Video */}
                    <WhatToExpectModal
                      name={isEspanol ? "cfe" : camelCaseName}
                    />
                  </Modal.Content>
                </Modal>
              </div>
            )}
          </div>
        </div>
        {isEspanol && <TenemoMasParaTi />}
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
      <h3 className="pt-3 text-lg font-bold text-navy md:text-2xl lg:w-36 lg:pt-0">
        Ways to Join Online
      </h3>
      <div className="flex gap-4 px-4">
        <Button
          href="https://www.youtube.com/c/ChristFellowshipWelcomeHome"
          intent="secondary"
          className="flex items-center justify-center"
          size="md"
        >
          <Icon size={28} name="youtube" color="#0092bc" className="mr-1" />
          Youtube
        </Button>
        <Button
          href="https://www.facebook.com/CFimpact/"
          intent="primary"
          className="flex items-center justify-center"
          size="md"
        >
          <Icon name="facebook" color="white" size={24} className="mr-1" />
          Facebook Live
        </Button>
      </div>
    </div>
  );
}

/**
 * Separating the following code into functions for readability purposes
 */
export function WaysToJoinOnlineDesktop() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="hidden flex-col items-center gap-4 text-center lg:flex lg:flex-row lg:items-start lg:gap-5 lg:border-0 lg:text-start">
      <h3 className="pt-3 text-lg font-bold text-navy md:text-2xl lg:w-36 lg:pt-0">
        Ways to Join Online
      </h3>
      <div className="flex gap-4 px-4">
        <Button
          href="https://www.youtube.com/c/ChristFellowshipWelcomeHome"
          intent="secondary"
          className="flex items-center gap-1 justify-center"
          size="md"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Icon
            name="youtube"
            color={isHovering ? "white" : "#0092BC"}
            size={28}
          />
          Youtube
        </Button>
        <Button
          href="https://www.facebook.com/CFimpact/"
          intent="primary"
          className="flex items-center justify-center"
          size="md"
        >
          <Icon name="facebook" color="white" size={24} className="mr-1" />
          Facebook Live
        </Button>
      </div>
    </div>
  );
}

export function DuringTheWeek() {
  const { name, weekdaySchedules } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");

  return (
    <div className="my-8 flex flex-col items-center gap-4 text-center lg:mt-0 lg:flex-row lg:items-start lg:gap-5 lg:text-start xl:gap-6">
      <div className="mx-auto w-4/5 border-t border-[#cecece] lg:hidden" />
      <h3 className="mt-12 text-[1.375rem] font-bold text-navy md:text-2xl lg:mt-0 lg:w-36">
        {isEspanol ? "Durante la Semana" : "During the Week"}
      </h3>
      <div className="flex flex-col gap-10 lg:flex-row xl:gap-14">
        {Object.entries(weekdaySchedules).map(([day, events]) => (
          <div key={day} className="flex flex-col">
            <h4 className="text-xl font-bold">
              {/* Translates day to Spanish if in Spanish page */}
              {isEspanol
                ? weekdaySpanishTranslation(startCase(day))
                : startCase(day)}
            </h4>
            {events.map((event: any, index: number) => (
              <div key={index} className="flex items-center">
                <p>
                  {event.time} - {event.title}
                </p>
                <Link to={event.url} className="pl-1">
                  <Icon name="linkExternal" size={12} color="#0092BC" />
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TenemoMasParaTi() {
  const { name } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col items-center gap-1 text-center lg:flex-row lg:items-start lg:gap-5 lg:border-0 lg:text-start">
      <h3 className="mt-8 text-[1.375rem] font-bold text-navy md:text-2xl lg:mt-0 lg:w-36">
        Tenemos más para ti
      </h3>
      <p className="italic px-4 md:max-w-[420px] lg:w-[42vw] lg:max-w-[600px] lg:px-0 xl:w-auto xl:max-w-[650px]">
        Consulta{" "}
        <a
          href={`/locations/iglesia-${
            name.includes("Gardens") ? "royal-palm-beach" : "palm-beach-gardens"
          }`}
          className="text-primary"
        >
          Christ Fellowship Church Español en{" "}
          {`${
            name.includes("Gardens") ? "Royal Palm Beach" : "Palm Beach Gardens"
          }`}
        </a>{" "}
        para conocer más espacios entre semana.
      </p>
    </div>
  );
}
