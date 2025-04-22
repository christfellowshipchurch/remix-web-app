import { useLoaderData } from "react-router-dom";
import { SeriesReturnType } from "./loader";
import { ScrollComponent } from "./partials/scroll-component";
import { Button } from "~/primitives/button/button.primitive";

export function SeriesResources() {
  const { series } = useLoaderData<SeriesReturnType>();

  return (
    <div className="flex flex-col">
      <img
        src={series.image}
        alt="Series Resources"
        className="w-full h-[45vh] md:h-[60vh] object-cover"
      />
      <div className="max-w-screen-content mx-auto">
        <div className="content-padding flex flex-col">
          {/* Info Section */}
          <div className="flex flex-col items-center py-16 gap-8 md:gap-6 text-center">
            <h1 className="text-2xl lg:text-[52px] font-extrabold leading-none">
              {series.title}
            </h1>
            <p className="lg:max-w-[720px] lg:text-lg">{series.description}</p>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-4 w-full  md:w-auto">
              {series.ctas?.map((cta, index) => (
                <Button
                  key={index}
                  intent={index === 0 ? "primary" : "secondary"}
                  className="w-full"
                  size="lg"
                  href={cta.url}
                >
                  {cta.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Series Messages */}
      <ScrollComponent
        title="Series Messages"
        items={series.messages}
        bg="gray"
      />

      {/* Resources Section */}
      <ScrollComponent
        title="Related Resources"
        summary="Explore other resources that may be of interest to you"
        items={series.resources}
        bg="white"
      />
    </div>
  );
}
