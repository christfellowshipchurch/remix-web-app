import { useLoaderData } from "react-router";
import Video from "~/primitives/video";
import { LoaderReturnType } from "../loader";
import lodash from "lodash";
import { setReminderVideos } from "../locations-single.data";
import {
  CfEveywhereSetReminder,
  DefaultSetReminder,
} from "./reminder-blocks.partial";

export const SetAReminder = () => {
  const { name, url } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");
  const setReminderVideo =
    setReminderVideos[lodash.camelCase(name) as keyof typeof setReminderVideos];

  // TODO: Missing Jupiter video
  return (
    <div
      className="flex w-full justify-center bg-[#F5F5F7] py-16 lg:py-20"
      id="set-a-reminder"
    >
      <div className="flex max-w-[1240px] flex-col items-center lg:gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-navy">
            {isEspanol
              ? "Establece un recordatorio para el próximo servicio"
              : "Set a Reminder for an Upcoming Service"}
          </h1>
          <p className="max-w-[90vw] pt-6 text-lg leading-6 md:max-w-[80vw] lg:max-w-[800px]">
            {isEspanol
              ? "Atender a la iglesia por primera vez no es fácil. Es por esto que hemos creado una forma sencilla para que puedas programar una visita y recibir un recordatorio. Aquí te explicamos cómo hacerlo."
              : "Attending church for the first time has never been easier. We’ve created a simple way for you to schedule a visit and receive a reminder. Here’s how to do it."}
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 lg:mx-8 lg:flex-row xl:gap-20">
          {name !== "Online (CF Everywhere)" && (
            <div className="mt-8 w-[90vw] overflow-hidden rounded-lg md:w-[80vw] lg:mt-0 lg:max-w-[760px] xl:w-[820px]">
              {/* TODO: Add wisita videos to Campuses in Rock and pull them here*/}
              <Video
                wistiaId={
                  isEspanol
                    ? setReminderVideos[
                        lodash.camelCase(url) as keyof typeof setReminderVideos
                      ]
                    : setReminderVideo
                }
                className="rounded-lg"
              />
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
