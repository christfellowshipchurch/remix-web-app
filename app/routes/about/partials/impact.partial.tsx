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
      className="flex flex-col items-center justify-center text-center p-6 lg:size-[240px] xl:size-[320px] mx-auto border border-neutral-500"
    >
      <div className="text-[80px] font-extrabold text-primary-300 mb-4 text-ocean">
        {value}
      </div>
      <p className="font-bold uppercase tracking-wider">{description}</p>
    </div>
  );
};
export function ImpactSection() {
  return (
    <section className="bg-dark-navy text-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-medium text-primary-300 mb-4">
          our impact.
        </h2>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="grid grid-rows-2 w-full">
            <div className="row-span-1">
              <h3 className="text-5xl font-bold mb-6">
                By the <br /> Numbers
              </h3>
              <p className="text-lg text-gray-300">
                Over the past year at Christ Fellowship Church, <br />
                our diverse ministries have made a significant impact on the
                world.
              </p>
            </div>
            <div className="row-span-1">
              <img
                src="/assets/images/about/impact-1.webp"
                alt="Mission Outreach Impact"
                className="ml-auto aspect-square max-w-[320px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
            <GridItem
              id="grid-item-1"
              value="108K"
              description="People Impacted Through Mission Outreach"
            />
            <img
              id="grid-item-2"
              src="/assets/images/about/impact-2.webp"
              alt="Kids Meals Impact"
              className="w-full"
            />
            <GridItem
              id="grid-item-3"
              value="571K"
              description="Kids Receive Hot Meals in 36 Different Countries"
            />
            <GridItem
              id="grid-item-4"
              value="79"
              description="Disasters Responded To"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
