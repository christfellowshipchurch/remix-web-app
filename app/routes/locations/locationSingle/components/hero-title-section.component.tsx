export const HeroTitleSection = ({ name }: { name: string }) => {
  let title = "Christ Fellowship Church";
  let subtitle =
    "A church that wants to help you live the life you were created for.";
  let location = name;

  if (name.includes("Español")) {
    title = "Christ Fellowship Church Español";
    subtitle =
      "Una iglesia que quiere ayudarte a vivir la vida para la que fuiste creado.";
    location = name.includes("Gardens")
      ? "Palm Beach Gardens"
      : "Royal Palm Beach";
  } else if (name.includes("Online")) {
    title = "Christ Fellowship Everywhere";
    subtitle = "Christ Fellowship Church Online";
    location = "";
  }

  return (
    <div className="flex flex-col">
      <h1 className="heading-h1">
        {title}{" "}
        {location && (
          <>
            <br className="hidden md:block" />{" "}
            {name.includes("Español") ? "en" : "in"} {location}
          </>
        )}
      </h1>
      <p className="mt-2 max-w-[320px] text-lg font-semibold md:max-w-full">
        {subtitle}
      </p>
    </div>
  );
};
