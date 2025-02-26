import { useLoaderData } from "react-router";
import { LoaderReturnType } from "../loader";
import { testimonialData } from "../locations-single.data";
import Icon from "~/primitives/icon";

export type Testimonies = {
  testimonies: {
    name: string;
    description: string;
    region?: string;
  }[];
};

export const Testimonials = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");
  const testimonies: Testimonies["testimonies"] =
    name === "Online (CF Everywhere)"
      ? testimonialData.cfEverywhere
      : isEspanol
      ? testimonialData.españolCampuses
      : testimonialData.default;

  return (
    <div className="flex flex-col items-center gap-12 bg-white px-8 py-20 lg:py-28">
      <h2 className="text-center heading-h3 text-navy">
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
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="star"
                    size={28}
                    fillRule="nonzero"
                    clipRule="nonzero"
                    color="#FCD757"
                  />
                ))}
              </div>
              <p className={`${item?.region ? "text-center" : ""}`}>
                {item?.description}
              </p>
            </div>
            <div className="flex flex-col-reverse items-center gap-4 lg:flex-row">
              {!item?.region && (
                <Icon
                  name="google"
                  size={48}
                  className="bg-white p-2 rounded-full"
                  color="#CCCCCC"
                />
              )}
              <div className="flex flex-col">
                <p className="text-lg font-bold text-navy">{item?.name}</p>
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
