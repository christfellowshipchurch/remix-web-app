import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export type Testimonies = {
  testimonies: {
    name: string;
    description: string;
    region?: string;
  }[];
};

export const Testimonials = ({ testimonies }: Testimonies) => {
  const { name } = useLoaderData<LoaderReturnType>();

  return (
    <div className="flex flex-col items-center gap-12 bg-white px-8 py-20 lg:py-28">
      <h2 className="text-center text-4xl font-bold text-secondary lg:text-start lg:text-[2.5rem]">
        {name.includes("Español")
          ? "Mira lo que otros dicen"
          : "See What Others Are Saying"}
      </h2>
      <div className="flex flex-col gap-8 lg:flex-row">
        {testimonies?.map((item, index) => (
          <div
            key={index}
            className={`flex w-full max-w-[90vw] flex-col items-center justify-between gap-8 self-stretch rounded-2xl bg-[#F5F5F7] p-8 text-center md:max-w-[420px] lg:h-[450px] lg:max-w-[360px] lg:gap-4 lg:text-start ${
              item?.region ? "lg:items-center" : "lg:items-start"
            }`}
          >
            <div
              className={`flex flex-col items-center gap-8 ${
                item?.region ? "lg:items-center" : "lg:items-start"
              }`}
            >
              <img
                src="/icons/stars.svg"
                width={100}
                height={20}
                alt="5 stars"
              />
              <p className={`${item?.region ? "text-center" : ""}`}>
                {item?.description}
              </p>
            </div>
            <div className="flex flex-col-reverse items-center gap-4 lg:flex-row">
              {!item?.region && (
                <div className="relative size-[34px] lg:size-[56px]">
                  <img
                    src="/icons/google-reviews.svg"
                    className="size-full"
                    alt="Google Reviews"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-lg font-bold text-secondary">{item?.name}</p>
                <p
                  className={`${
                    !item?.region ? "hidden" : ""
                  } text-center lg:block`}
                >
                  {item?.region ? <i>{item?.region}</i> : `Google Reviews`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
