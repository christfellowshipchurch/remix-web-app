import { useLoaderData } from "react-router-dom";
import { SeriesReturnType } from "./loader";
import { SeriesResourceCarousel } from "./partials/resource-carousel.partial";
import { Button } from "~/primitives/button/button.primitive";

export function SeriesResources() {
  const { series, messages, resources } = useLoaderData<SeriesReturnType>();

  return (
    <div className="flex flex-col">
      <img
        src={series.attributeValues.coverImage}
        alt="Series Resources"
        className="w-full h-[45vh] md:h-[60vh] object-cover"
      />
      <div className="max-w-screen-content mx-auto">
        <div className="content-padding flex flex-col">
          {/* Info Section */}
          <div className="flex flex-col items-center py-16 gap-8 md:gap-6 text-center">
            <h1 className="text-2xl lg:text-[52px] font-extrabold leading-none">
              {series.value}
            </h1>
            <p className="lg:max-w-[720px] lg:text-lg">{series.description}</p>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-4 w-full  md:w-auto">
              <Button
                intent="primary"
                className="w-full"
                size="lg"
                href="/locations"
              >
                Times and Locations
              </Button>

              <Button
                intent="secondary"
                className="w-full"
                size="lg"
                href="/app"
              >
                App Devoltional
              </Button>

              {/* TODO: If we want CTAs to come from Rock */}
              {/* {series.attributeValues.callToActions &&
              series.attributeValues.callToActions.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 w-full  md:w-auto">
                  {series.attributeValues.callToActions?.map((cta, index) => (
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
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
        {/* Series Messages */}
        <SeriesResourceCarousel
          title="Series Messages"
          items={messages}
          bg="gray"
        />

        {/* Resources Section */}
        {resources && resources.length > 0 && (
          <SeriesResourceCarousel
            title="Related Resources"
            summary="Explore other resources that may be of interest to you"
            items={resources}
            bg="white"
          />
        )}
      </div>
    </div>
  );
}
