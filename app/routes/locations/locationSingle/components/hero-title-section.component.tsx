export const HeroTitleSection = ({ name }: { name: string }) => {
  if (name.includes("Español")) {
    const spanishLocation = name?.includes("Gardens")
      ? "Palm Beach Gardens"
      : "Royal Palm Beach";
    return (
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold md:text-6xl">
          Christ Fellowship Church Español <br className="hidden md:block" /> en{" "}
          <br className="md:hidden" />
          {spanishLocation}
        </h1>
        <p className="mt-2 max-w-[320px] text-xl font-semibold md:max-w-none">
          Una iglesia que quiere ayudarte a vivir la vida para la que fuiste
          creado.
        </p>
      </div>
    );
  } else if (name.includes("Online")) {
    return (
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold md:text-6xl">
          Christ Fellowship Everywhere
        </h1>
        <p className="mt-2 max-w-[320px] text-2xl font-semibold md:max-w-none">
          Christ Fellowship Church Online
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <h1 className="text-4xl font-extrabold md:text-6xl">
        Christ Fellowship Church <br className="hidden md:block" /> in{" "}
        <br className="md:hidden" />
        {name}
      </h1>
      <p className="mt-2 max-w-[320px] text-xl font-semibold md:max-w-none">
        A church that wants to help you live the life you were created for.
      </p>
    </div>
  );
};
