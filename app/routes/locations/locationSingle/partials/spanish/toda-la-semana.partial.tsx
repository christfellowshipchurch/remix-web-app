import { Link, useLoaderData } from "react-router";
import { LoaderReturnType } from "../../loader";
import { locationBlockData } from "../../locations-single.data";
import HTMLRenderer from "~/primitives/html-renderer";

export const TodaLaSemana = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const blockData = locationBlockData(name);

  return (
    <div className="flex px-4 w-full flex-col items-center bg-[#F5F5F7] py-10 md:py-16 lg:py-20 xl:py-24">
      <h1 className="text-3xl font-bold text-navy mb-3">Toda la semana</h1>
      <p className="italic text-center">
        *Opciones en español disponibles.{" "}
        <span className="font-bold">
          Algunos eventos se ofrecen solo en inglés o en nuestro campus de Royal
          Palm Beach.
        </span>
      </p>

      {/* Cards */}
      <div className="grid gap-[40px] pt-6 lg:pt-12 md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-16">
        {blockData?.map((data, index) => (
          <Link
            to={data?.actions[0]?.relatedNode?.url}
            key={index}
            className="w-[90vw] overflow-hidden rounded-lg bg-white md:max-w-[340px] lg:max-w-[410px] lg:w-[410px] transition-transform duration-300 hover:-translate-y-3"
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative sm:h-[320px] h-[240px] md:h-[190px] lg:h-[250px] w-full">
              <img
                src={data?.coverImage?.sources[0]?.uri}
                alt={data?.title}
                className="size-full"
              />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-2xl font-bold">{data?.title}</h2>
              <h3 className="text-sm font-semibold text-ocean">
                {data?.subtitle}
              </h3>
              <HTMLRenderer html={data?.htmlContent} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
