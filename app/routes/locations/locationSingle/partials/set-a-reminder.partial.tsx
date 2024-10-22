import { useLoaderData } from "@remix-run/react";
import Video from "~/primitives/Video";
import { LoaderReturnType } from "../loader";
import { camelCase } from "lodash";
import { setReminderVideos } from "../locations-single.data";
import {
  CfEveywhereSetReminder,
  DefaultSetReminder,
} from "./reminder-blocks.partial";

export const SetAReminder = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const setReminderVideo =
    setReminderVideos[camelCase(name) as keyof typeof setReminderVideos];

  return (
    <div
      className="flex w-full justify-center bg-[#F5F5F7] py-16 lg:py-20"
      id="set-a-reminder"
    >
      <div className="flex max-w-[1240px] flex-col items-center lg:gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-wordOfChrist">
            Set a Reminder for an Upcoming Service
          </h1>
          <p className="max-w-[90vw] pt-6 text-lg leading-6 md:max-w-[80vw] lg:max-w-[800px]">
            Attending church for the first time has never been easier. We’ve
            created a simple way for you to schedule a visit and receive a
            reminder. Here’s how to do it.
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 lg:mx-8 lg:flex-row xl:gap-20">
          {name !== "Online (CF Everywhere)" && (
            <div className="mt-8 w-[90vw] overflow-hidden rounded-lg md:w-[80vw] lg:mt-0 lg:max-w-[760px] xl:w-[820px]">
              {/* TODO: Setup Wistia Videos */}
              <Video wistiaId={setReminderVideo} className="rounded-lg" />
            </div>
          )}
          {name === "Online (CF Everywhere)" ? (
            // CF Everywhere
            <CfEveywhereSetReminder />
          ) : (
            // Other Locations
            <DefaultSetReminder />
          )}
        </div>
      </div>
    </div>
  );
};

export default SetAReminder;
