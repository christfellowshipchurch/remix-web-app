import { SectionTitle } from "~/components";

const GridItem = ({
  id,
  value,
  description,
}: {
  id: string;
  value: string;
  description: string;
}) => {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center text-center p-6 aspect-square border-[0.5px] border-neutral-500 md:max-h-[220px] lg:max-h-none"
    >
      <div className="text-[80px] font-extrabold text-primary-300 mb-4 md:mb-0 lg:mb-4 text-ocean">
        {value}
      </div>
      <p className="font-bold uppercase tracking-wider">{description}</p>
    </div>
  );
};

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="bg-dark-navy text-white content-padding py-24"
    >
      <div className="flex w-full max-w-screen-content mx-auto">
        <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row items-center lg:h-[580px] xl:h-[640px] w-full">
          <div className="grid lg:grid-rows-2 flex-1 h-full">
            <div className="row-span-1">
              <div className="flex flex-col gap-8">
                <SectionTitle sectionTitle="our impact." />
                <h3 className="text-[52px] md:text-5xl leading-tight font-extrabold mb-6">
                  By the <br /> Numbers
                </h3>
              </div>
              <p className="text-lg xl:text-xl pr-2">
                Over the past year at Christ Fellowship Church,{" "}
                <br className="hidden xl:block" />
                our diverse ministries have made a significant impact on the
                world.
              </p>
            </div>
            <div className="row-span-1 hidden lg:block">
              <img
                src="/assets/images/about/impact-1.webp"
                alt="Mission Outreach Impact"
                className="ml-auto aspect-square w-full max-w-[290px] xl:max-w-[320px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 lg:w-[580px] xl:w-[640px] h-full mx-auto">
            <div className="w-full md:w-[220px] hidden md:flex lg:hidden flex-col justify-between">
              <div className="hidden md:block lg:hidden"></div>
              <img
                src="/assets/images/about/impact-1.webp"
                alt="Mission Outreach Impact"
                className="ml-auto aspect-square w-full md:max-w-[220px] lg:max-w-[290px] xl:max-w-[320px]"
              />
            </div>
            <div className="w-full md:w-[220px] lg:w-[290px] xl:w-[320px]">
              <GridItem
                id="grid-item-1"
                value="108K"
                description="People Impacted Through Mission Outreach"
              />
              <GridItem
                id="grid-item-3"
                value="571K"
                description="Kids Receive Hot Meals in 36 Different Countries"
              />
            </div>
            <div className="w-full md:w-[220px] lg:w-[290px] xl:w-[320px]">
              <img
                id="grid-item-2"
                src="/assets/images/about/impact-2.webp"
                alt="Kids Meals Impact"
                className="w-full md:size-[220px] lg:size-[290px] xl:size-[320px] object-cover"
              />
              <GridItem
                id="grid-item-4"
                value="79"
                description="Disasters Responded To"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
