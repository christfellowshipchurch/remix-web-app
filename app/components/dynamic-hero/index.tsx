import Button from "~/primitives/button";
import Icon from "~/primitives/icon";

export type DynamicHeroTypes = {
  imagePath: string;
  ctas?: { href: string; title: string }[];
};

export const DynamicHero = ({ imagePath, ctas }: DynamicHeroTypes) => {
  // TODO: Get from url
  const pagePath = "Articles";

  return (
    <div
      className="flex items-center justify-start self-stretch h-[640px]"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 85.64%, rgba(0, 0, 0, 0.70) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 48.79%, rgba(0, 0, 0, 0.80) 100%), url(${imagePath}) lightgray 50% / cover no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col gap-12 w-full px-10 pb-16 md:px-36 items-start justify-end self-stretch">
        <h1 className="font-extrabold text-[100px] text-white">{pagePath}</h1>
        <div className="h-[2px] self-stretch bg-[#D9D9D9]" />
        <div className="flex items-center justify-between self-stretch">
          <div className="flex items-center gap-4 text-[#ADA09B]">
            <p>Home</p>
            <Icon color="#0092BC" size={20} name="caretRight" />
            <p>{pagePath}</p>
          </div>
          <div className="flex gap-6 relative pr-4">
            {ctas?.map((cta, i) => (
              <Button
                key={i}
                href={cta.href}
                intent="secondary"
                className="text-white border-white rounded-none hover:enabled:bg-slate-300/20"
              >
                {cta.title}
              </Button>
            ))}
            <div
              className={`${
                (ctas?.length ?? 0) < 1 ? "hidden" : ""
              } rounded-full p-3 bg-ocean absolute -right-6 top-[50%] translate-y-[-50%]`}
            >
              <Icon
                style={{ transform: "rotate(135deg)" }}
                name="arrowBack"
                size={26}
                color="white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
