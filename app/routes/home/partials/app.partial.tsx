import { Link } from "react-router";

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
    <section className="bg-navy content-padding w-full py-28 hidden md:block">
      <div className="max-w-screen-content mx-auto flex justify-center gap-8 items-center">
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
          <div className="flex gap-4">
            <Link to="https://apps.apple.com/us/app/christ-fellowship-app/id785979426">
              <img
                src="/assets/images/home/apple-store.png"
                className="w-[170px] h-[54px]"
              />
            </Link>
            <Link to="https://play.google.com/store/apps/details?id=com.subsplash.thechurchapp.s_BSVMPR&pcampaignid=web_share">
              <img
                src="/assets/images/home/google-play.png"
                className="w-[170px] h-[54px]"
              />
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-image.png"
            alt="App Section Image"
            className="w-full aspect-[4/5] lg:aspect-[41/49] md:max-w-[240px] lg:max-w-[400px]"
          />
        </div>
      </div>
    </section>
  );
};

const MobileVersion = () => {
  return (
    <section className="bg-navy content-padding w-full py-16 md:hidden">
      <div className="max-w-screen-content mx-auto flex flex-col gap-8 items-center">
        <h2 className="text-white text-center text-[32px] leading-tight max-w-[340px]">
          Grow in your <span className="font-extrabold">faith. Every day </span>
          of the week.
        </h2>

        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-image.png"
            alt="App Section Image"
            className="w-full aspect-[26/32]"
          />
        </div>

        <p className="text-white text-center leading-tight">
          The Christ Fellowship App experience was designed to help you grow in
          your faith every day of the week. Through its features, you can stay
          consistent in your time with God.
        </p>

        {/* Buttons Section */}
        <div className="flex gap-4">
          <Link to="https://apps.apple.com/us/app/christ-fellowship-app/id785979426">
            <img
              src="/assets/images/home/apple-store.png"
              className="w-[170px] h-[54px]"
            />
          </Link>
          <Link to="https://play.google.com/store/apps/details?id=com.subsplash.thechurchapp.s_BSVMPR&pcampaignid=web_share">
            <img
              src="/assets/images/home/google-play.png"
              className="w-[170px] h-[54px]"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
