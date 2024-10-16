import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "../loader";

export const AtThisLocation = () => {
  const { name } = useLoaderData<LoaderReturnType>();

  const mockData = [
    {
      title: "For Kids",
      subtitle: "Babies to Elementary",
      content:
        "Christ Fellowship Kids is designed to partner with parents as together, we lead our kids to love Jesus, love others, and love life.",
      image: "",
    },
    { title: "For Students", subtitle: "", content: "", image: "" },
    { title: "For Young Adults", subtitle: "", content: "", image: "" },
    { title: "Groups and Classes", subtitle: "", content: "", image: "" },
  ];
  return (
    <div className="flex w-full flex-col items-center bg-[#F5F5F7] py-10 lg:py-20 xl:py-24">
      <h1 className="text-3xl font-bold text-secondary">
        {name === "cf-everywhere"
          ? "Digital Offerings for Everyone"
          : "At This Location"}
      </h1>
      <p className="text-lg">{`See what's here for you!`}</p>
      {/* Content */}
      <div className="grid gap-[40px] pt-12 md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-16">
        {mockData?.map((data, index) => (
          <div
            key={index}
            className="w-[90vw] overflow-hidden rounded-lg bg-white md:max-w-[420px] lg:w-[410px]"
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative h-[210px] w-full">
              <img
                src="/location-pages/kids-image.jpg"
                alt={data?.title}
                className="size-full"
              />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-2xl font-bold">{data?.title}</h2>
              <h3 className="text-sm font-semibold text-primary">
                {data?.subtitle}
              </h3>
              <p>{data?.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
