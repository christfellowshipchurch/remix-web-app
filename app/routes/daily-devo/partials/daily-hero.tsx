import { Button } from "~/primitives/button/button.primitive";
import { LoaderReturnType } from "../loader";
import Icon from "~/primitives/icon";
import { useLoaderData } from "react-router";
import { appleLink, cn, googleLink, isAppleDevice } from "~/lib/utils";
import { VideoModal } from "~/components/modals/video-modal";

export const DailyHero = () => {
  const { appPromoVideo, avatars, dailyDevo } =
    useLoaderData<LoaderReturnType>();
  const { startDateTime } = dailyDevo;
  const formattedDateTime = new Date(startDateTime).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="bg-gradient-to-t from-[#F3F5FA] to-white lg:pt-16 pb-10 lg:pb-0 content-padding">
        <div className="max-w-[1080px] mx-auto flex flex-col-reverse lg:flex-row items-center lg:gap-8 xl:!gap-24">
          <div className="flex flex-col gap-4 flex-1">
            {/* Date */}
            <div className="flex items-center gap-1 px-[10px] py-[6px] rounded-[28px] bg-neutral-lightest w-fit">
              <Icon name="calendarAlt" />
              <p className="text-black text-sm font-semibold">
                {formattedDateTime}
              </p>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1 md:gap-4">
              <h1 className="text-[40px] lg:text-[48px] xl:text-[52px] font-extrabold">
                Daily Devotional
              </h1>
              <p className="md:text-lg font-medium text-text-secondary">
                Start each day with spiritual nourishment. Our daily devotionals
                help you grow in faith and develop a consistent spiritual
                practice.
              </p>
            </div>

            <div className="relative flex flex-col-reverse md:flex-row lg:flex-wrap gap-4 mt-8 md:mt-0">
              <VideoModal
                wistiaId={appPromoVideo}
                intent="primary"
                ModalButton={({ onClick, ...props }) => (
                  <Button
                    {...props}
                    onClick={onClick}
                    className="w-full md:w-fit flex items-center gap-2 min-w-[122px] rounded-[4px]"
                  >
                    <Icon name="playCircle" />
                    Intro
                  </Button>
                )}
                videoClassName="w-full h-full rounded-lg"
              />

              <Button
                onClick={() =>
                  window.open(
                    isAppleDevice() ? appleLink : googleLink,
                    "_blank"
                  )
                }
                className="w-full md:w-auto flex items-center gap-3 rounded-lg bg-transparent border border-solid border-neutral-lighter hover:!bg-neutral-lightest"
              >
                <div className="flex -space-x-[10px]">
                  {avatars.slice(0, 3).map((avatar, i) => (
                    <img
                      key={i}
                      src={avatar.src}
                      alt={avatar.alt}
                      className="size-7 rounded-full border-4 border-[#F6F7FB] border-solid"
                    />
                  ))}
                </div>

                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#80E4A8] rounded-full" />
                    <p className="text-xs font-semibold text-black">
                      1.2k+ people online now.{" "}
                    </p>
                  </div>
                  <p className="w-full text-xs font-semibold text-text-secondary">
                    Join our growing community.
                  </p>
                </div>
              </Button>
            </div>
          </div>

          <div className="my-20 relative">
            <div className="rounded-xl border-12 border-solid border-ocean/20">
              <img
                src={dailyDevo.coverImage}
                alt="Daily Devo Hero"
                className={cn(
                  "w-full object-cover max-w-xl lg:max-w-[60vw] rounded aspect-[4/3]",
                  "lg:max-w-[480px] md:aspect-auto lg:object-cover"
                )}
              />
            </div>
            <img
              src="/assets/images/daily/daily-streak.webp"
              alt="Daily Devo Hero"
              className="absolute -bottom-10 -right-10 w-40 hidden lg:block"
            />
          </div>
        </div>
      </div>
    </>
  );
};
