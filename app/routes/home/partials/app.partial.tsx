import { Link } from "react-router";
import { appleLink, cn, googleLink, isAppleDevice } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";

export function AppSection({
  layout = "imageRight",
  className,
  dynamicButton = false,
}: {
  layout?: "imageLeft" | "imageRight";
  className?: string;
  dynamicButton?: boolean;
}) {
  const isApple = isAppleDevice();
  const appLink = isApple ? appleLink : googleLink;

  return (
    <>
      <DesktopVersion
        layout={layout}
        appLink={appLink}
        className={className}
        dynamicButton={dynamicButton}
      />
      <MobileVersion
        appLink={appLink}
        className={className}
        layout={layout}
        dynamicButton={dynamicButton}
      />
    </>
  );
}

const DesktopVersion = ({
  layout,
  appLink,
  className,
  dynamicButton,
}: {
  layout: "imageLeft" | "imageRight";
  appLink: string;
  className?: string;
  dynamicButton: boolean;
}) => {
  return (
    <section
      className={cn(
        "bg-navy content-padding w-full py-28 hidden md:block",
        className
      )}
    >
      <div
        className={cn(
          "max-w-screen-content mx-auto flex justify-center gap-8 items-center",
          layout === "imageLeft" ? "flex-row-reverse" : "flex-row"
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

          {/* Buttons Section */}
          {dynamicButton ? (
            <div className="flex flex-col gap-1 text-white">
              <Button
                href={appLink}
                intent="primary"
                className="w-fit font-semibold text-lg min-w-[200px]"
              >
                Download The App Now!
              </Button>
              <p className="text-sm opacity-60">
                Available for IOS and Android
              </p>
            </div>
          ) : (
            <AppButtons />
          )}
        </div>

        <div className="flex justify-center items-center">
          <img
            src={
              layout === "imageLeft"
                ? "/assets/images/home/app-left.webp"
                : "/assets/images/home/app-image.png"
            }
            alt="App Section Image"
            className={cn("w-full aspect-portrait max-w-[232px]")}
          />
        </div>
      </div>
    </section>
  );
};

const MobileVersion = ({
  appLink,
  className,
  layout,
  dynamicButton,
}: {
  appLink: string;
  dynamicButton: boolean;
  className?: string;
  layout: "imageLeft" | "imageRight";
}) => {
  return (
    <section
      className={cn(
        "bg-navy content-padding w-full py-16 md:hidden",
        className
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
            src={
              layout === "imageLeft"
                ? "/assets/images/home/app-left.webp"
                : "/assets/images/home/app-image.png"
            }
            alt="App Section Image"
            className={cn(
              layout === "imageLeft" ? "w-[50vw]" : "w-full",
              layout === "imageLeft" ? "aspect-portrait" : "aspect-[26/32]"
            )}
          />
        </div>

        <p className="text-white text-center leading-tight">
          The Christ Fellowship App experience was designed to help you grow in
          your faith every day of the week. Through its features, you can stay
          consistent in your time with God.
        </p>

        {/* Buttons Section */}
        {dynamicButton ? (
          <div className="flex flex-col gap-1 text-white">
            <Button
              href={appLink}
              intent="primary"
              className="w-fit font-semibold text-lg min-w-[200px]"
            >
              Download The App Now!
            </Button>
            <p className="text-sm opacity-60 text-center w-full">
              Available for IOS and Android
            </p>
          </div>
        ) : (
          <AppButtons />
        )}
      </div>
    </section>
  );
};

const AppButtons = () => {
  return (
    <div className="flex gap-4">
      <Link
        to="https://apps.apple.com/us/app/christ-fellowship-app/id785979426"
        data-platform="ios"
      >
        <img
          src="/assets/images/home/apple-store.png"
          className="w-[170px] h-[54px]"
        />
      </Link>
      <Link
        to="https://play.google.com/store/apps/details?id=com.subsplash.thechurchapp.s_BSVMPR&pcampaignid=web_share"
        data-platform="android"
      >
        <img
          src="/assets/images/home/google-play.png"
          className="w-[170px] h-[54px]"
        />
      </Link>
    </div>
  );
};
