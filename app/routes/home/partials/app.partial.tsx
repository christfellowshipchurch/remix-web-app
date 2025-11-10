import { appleLink, cn, googleLink, isAppleDevice } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

export function AppSection() {
  return (
    <>
      <DesktopVersion />
      <MobileVersion />
    </>
  );
}

const DesktopVersion = () => {
  return (
    <section
      className={cn(
        "bg-gradient-to-b from-[#00354D] via-[#00354D] to-navy content-padding w-full py-28 hidden md:block relative z-30"
      )}
    >
      <div
        className={cn(
          "max-w-screen-content mx-auto flex justify-center gap-8 lg:gap-16 items-center flex-row-reverse"
        )}
      >
        <div className="flex flex-col gap-16 text-white">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-[40px] leading-tight">
                Grow in your{" "}
                <span className="font-extrabold">
                  faith. <br /> Every day
                </span>{" "}
                of the week.
              </h2>
              <p className="text-lg">
                Download the Christ Fellowship Church App
              </p>
            </div>
            <p className="max-w-[490px]">
              The Christ Fellowship App experience was designed to help you grow
              in your faith every day of the week. Through its features, you can
              stay consistent in your time with God.
            </p>
          </div>

          <AppButtons />
        </div>

        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-left.webp"
            alt="App Section Image"
            className={cn("w-full aspect-[9/21] max-w-[220px]")}
          />
        </div>
      </div>
    </section>
  );
};

const MobileVersion = () => {
  return (
    <section
      className={cn(
        "bg-gradient-to-b from-[#00354D] via-[#00354D] to-navy content-padding w-full py-16 md:hidden relative z-30"
      )}
    >
      <div className="max-w-screen-content mx-auto flex flex-col gap-8 items-center">
        <h2
          className={cn(
            "text-white text-center text-[32px] leading-tight max-w-[340px]"
          )}
        >
          Grow in your <span className="font-extrabold">faith. Every day </span>
          of the week.
        </h2>

        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-left.webp"
            alt="App Section Image"
            className={cn("w-[50vw]", "aspect-[9/21]", "max-w-[140px]")}
          />
        </div>

        <p className="text-white text-center leading-tight max-w-[420px]">
          The Christ Fellowship App experience was designed to help you grow in
          your faith every day of the week. Through its features, you can stay
          consistent in your time with God.
        </p>

        <AppButtons />
      </div>
    </section>
  );
};

const AppButtons = () => {
  const isApple = isAppleDevice();
  const appLink = isApple ? appleLink : googleLink;

  return (
    <div className="flex flex-col gap-2 text-white">
      <Button
        href={appLink}
        intent="primary"
        className="w-fit font-semibold text-lg min-w-[200px]"
      >
        Download The App Now!
      </Button>
      <p className="text-sm opacity-60 text-center md:text-left">
        Available for IOS and Android
      </p>
    </div>
  );
};
