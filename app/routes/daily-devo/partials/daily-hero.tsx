import { Button } from "~/primitives/button/button.primitive";
import { LoaderReturnType } from "../loader";
import Icon from "~/primitives/icon";
import { useLoaderData } from "react-router";
import { appleLink, cn, googleLink, isAppleDevice } from "~/lib/utils";
import { useRef, useState, useEffect } from "react";

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

  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);

  // Desktop Video fullscreen functions
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    `https://fast.wistia.net/embed/iframe/${appPromoVideo}?fitStrategy=cove`
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsVideoPlaying(false);
        // Reset video URL to stop autoplay and reset the video
        setVideoUrl(
          `https://fast.wistia.net/embed/iframe/${appPromoVideo}?fitStrategy=cove`
        );
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [appPromoVideo]);

  const handleFullscreen = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    setIsVideoPlaying(true);
    setVideoUrl(
      `https://fast.wistia.net/embed/iframe/${appPromoVideo}?fitStrategy=cove&autoplay=1`
    );

    if (isMobile) {
      setIsMobileFullscreen(true); // use fake fullscreen
      return;
    }

    // Try true fullscreen on desktop
    if (iframeRef.current?.requestFullscreen) {
      iframeRef.current.requestFullscreen();
    }
  };

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
              <iframe
                ref={iframeRef}
                src={videoUrl}
                allow="autoplay; fullscreen"
                allowFullScreen
                className={cn(
                  "size-full",
                  "rounded-[12px] -bottom-40 z-10 absolute",
                  {
                    "opacity-100": isVideoPlaying,
                    "opacity-0": !isVideoPlaying,
                  }
                )}
              />
              <Button
                onClick={handleFullscreen}
                intent="primary"
                className="w-full md:w-fit flex items-center gap-2 min-w-[122px] rounded-[4px]"
              >
                <Icon name="playCircle" />
                Intro
              </Button>

              <Button
                onClick={() =>
                  window.open(
                    isAppleDevice() ? appleLink : googleLink,
                    "_blank"
                  )
                }
                className="w-full md:w-auto flex items-center gap-3 rounded-[8px] bg-transparent border border-solid border-neutral-lighter hover:!bg-neutral-lightest"
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

          <img
            src="/assets/images/daily-hero-mobile.webp"
            alt="Daily Devo Hero"
            className="lg:hidden w-full aspect-square object-contain max-w-[70vw]"
          />

          <img
            src="/assets/images/daily-hero-desktop.webp"
            alt="Daily Devo Hero"
            className="hidden lg:block w-full aspect-square object-contain max-w-[480px]"
          />
        </div>
      </div>
      {isMobileFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => {
              setIsMobileFullscreen(false);
              setIsVideoPlaying(false);
              setVideoUrl(
                `https://fast.wistia.net/embed/iframe/${appPromoVideo}?fitStrategy=cove`
              );
            }}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          <iframe
            src={videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
    </>
  );
};
