import { IconButton } from "~/primitives/button/icon-button.primitive";
import { useLoaderData } from "react-router";
import type { LoaderReturnType } from "../loader";
import { cn } from "~/lib/utils";

export function VolunteerFeaturedEvent() {
  const { mockVolunteerFeaturedEvent } = useLoaderData<LoaderReturnType>();
  const { title, subtitle, description, url, imageUrl } =
    mockVolunteerFeaturedEvent;
  return (
    <section id="featured-event">
      <div className="ml-auto w-[95vw] min-[1600px]:w-[90vw] bg-white relative hidden md:block">
        <div
          style={{ backgroundImage: `url(${imageUrl})` }}
          className={cn(
            "bg-cover bg-no-repeat",
            "md:bg-[right_0px_top_-80px]",
            "lg:bg-[right_0px_top_-200px]"
          )}
        >
          <div className="relative inline-flex flex-col gap-4 bg-white p-12 z-10 lg:-ml-12 top-50">
            <span className="text-ocean font-semibold mb-2 block">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-neutral-dark mb-8 max-w-[490px]">
              {description}
            </p>
            <IconButton
              to={url}
              withRotatingArrow
              className="bg-white border-neutral-default text-neutral-dark hover:enabled:bg-soft-white hover:enabled:text-neutral-dark"
              aria-label={`Learn more about ${title}`}
            >
              Learn More
            </IconButton>
          </div>
        </div>
      </div>
      <div className="w-full h-80 bg-gray hidden md:block" />
      {/* Mobile */}
      <div className="w-full bg-gray content-padding relative block md:hidden py-20">
        <div className="max-w-screen-content mx-auto rounded-4xl overflow-hidden">
          <a href={url} className="block">
            <img
              src={imageUrl}
              alt={`Volunteers at ${title} event`}
              className="w-full object-cover max-h-44 sm:max-h-64"
            />
            <div className="flex flex-col py-10 gap-4 bg-white p-6 z-10">
              <span className="text-ocean font-bold block">{subtitle}</span>
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
              <p className="text-text-secondary text-pretty">{description}</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
