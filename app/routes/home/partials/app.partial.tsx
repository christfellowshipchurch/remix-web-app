import { appleLink, cn, googleLink, isAppleDevice } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import HTMLRenderer from "~/primitives/html-renderer";

export function AppSection({ isSpanish }: { isSpanish?: boolean }) {
  return (
    <>
      <DesktopVersion isSpanish={isSpanish} />
      <MobileVersion isSpanish={isSpanish} />
    </>
  );
}

const DesktopVersion = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish ? spanishCopy : englishCopy;

  return (
    <section
      className={cn(
        "bg-linear-to-b from-[#222323] via-dark-navy to-navy content-padding w-full py-28 hidden md:block relative z-30",
      )}
    >
      <div
        className={cn(
          "max-w-screen-content mx-auto flex justify-center gap-8 lg:gap-16 items-center flex-row-reverse",
        )}
      >
        <div className="flex flex-col gap-16 text-white">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-[40px] leading-tight">
                <HTMLRenderer html={copy.title as string} />
              </h2>
              <p className="text-lg">{copy.subtitle}</p>
            </div>
            <p className="max-w-[490px]">{copy.summary}</p>
          </div>

          <AppButtons isSpanish={isSpanish} />
        </div>

        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-left.webp"
            alt="App Section Image"
            className={cn("w-full aspect-9/21 max-w-[220px]")}
          />
        </div>
      </div>
    </section>
  );
};

const MobileVersion = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish ? spanishCopy : englishCopy;

  return (
    <section
      className={cn(
        "bg-linear-to-b from-[#222323] via-dark-navy to-navy content-padding w-full py-16 md:hidden relative z-30",
      )}
    >
      <div className="max-w-screen-content mx-auto flex flex-col gap-8 items-center">
        <h2
          className={cn(
            "text-white text-center text-[32px] leading-tight max-w-[340px]",
          )}
        >
          <HTMLRenderer html={copy.title as string} />
        </h2>

        <div className="flex justify-center items-center">
          <img
            src="/assets/images/home/app-left.webp"
            alt="App Section Image"
            className={cn("w-[50vw]", "aspect-9/21", "max-w-[140px]")}
          />
        </div>

        <p className="text-white text-center leading-tight max-w-[420px]">
          {copy.summary}
        </p>

        <AppButtons isSpanish={isSpanish} />
      </div>
    </section>
  );
};

const AppButtons = ({ isSpanish }: { isSpanish?: boolean }) => {
  const copy = isSpanish ? spanishCopy : englishCopy;

  const isApple = isAppleDevice();
  const appLink = isApple ? appleLink : googleLink;

  return (
    <div className="flex flex-col gap-2 text-white">
      <Button
        href={appLink}
        intent="primary"
        className="w-fit font-semibold text-lg min-w-[200px]"
      >
        {copy.button}
      </Button>
      <p className="text-sm opacity-60 text-center md:text-left">
        {copy.available}
      </p>
    </div>
  );
};

const spanishCopy = {
  title: `Crece en <span className="font-extrabold">tu fe. <br/> Cada día</span> de la semana.`,
  summary:
    "La experiencia de la app de la Christ Fellowship fue diseñada para ayudarte a crecer en tu fe cada día de la semana. A través de sus características, puedes mantenerte consistente en tu tiempo con Dios.",
  subtitle: "Descarga la app de la Christ Fellowship",
  button: "Descargar la app ahora!",
  available: "Disponible para iOS y Android",
};

const englishCopy = {
  title: `Grow in your <span className="font-extrabold">faith. <br /> Every day</span> of the week.`,
  summary:
    "The Christ Fellowship App experience was designed to help you grow in your faith every day of the week. Through its features, you can stay consistent in your time with God.",
  subtitle: "Download the Christ Fellowship Church App",
  button: "Download The App Now!",
  available: "Available for IOS and Android",
};
