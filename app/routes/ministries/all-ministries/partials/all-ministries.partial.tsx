import { ResourceCard } from "~/components";

type Ministry = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const AllMinistriesPartial = ({
  ministries,
}: {
  ministries: Ministry[];
}) => {
  return (
    <div className="content-padding  bg-background-secondary py-16 md:py-24 xl:py-32">
      <div className="max-w-screen-content mx-auto">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-20">
          <h1 className="font-extrabold text-[32px]">
            Programs and Ministries
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 md:gap-y-8 lg:gap-y-20 md:gap-x-8 xl:gap-x-12">
            {ministries.map((ministry, i) => (
              <ResourceCard key={i} {...ministry} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
