import Button from "~/primitives/button";
import Icon from "~/primitives/icon";

export const ArticlesHeroPartial = () => {
  return (
    <div
      className="flex items-center justify-start self-stretch h-[640px]"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.00) 85.64%, rgba(0, 0, 0, 0.70) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 48.79%, rgba(0, 0, 0, 0.80) 100%), url(${"../app/assets/images/articles-hero-bg.jpg"}) lightgray 50% / cover no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col gap-12 w-full pb-16 px-36 items-start justify-end self-stretch">
        <h1 className="font-extrabold text-[100px] text-white">Articles</h1>
        <div className="h-[2px] self-stretch bg-[#D9D9D9]" />
        <div className="flex items-center justify-between self-stretch">
          <div className="flex items-center gap-4 text-[#ADA09B]">
            <p>Home</p>
            <Icon color="ocean" size={32} name="check" />
            <p>Articles</p>
          </div>
          <div className="flex relative pr-4">
            <Button intent="secondary" className="text-white border-white">
              Call to Action
            </Button>
            <div className="rounded-full p-3 bg-ocean absolute -right-6 top-[50%] translate-y-[-50%]">
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
