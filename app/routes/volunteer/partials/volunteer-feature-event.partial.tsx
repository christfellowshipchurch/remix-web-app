import { IconButton } from "~/primitives/button/icon-button.primitive";
import { Link, useLoaderData } from "react-router-dom";
import type { LoaderReturnType } from "../loader";
import { cn } from "~/lib/utils";
import HTMLRenderer from "~/primitives/html-renderer";

export function VolunteerFeaturedEvent() {
  const { featuredEvent } = useLoaderData<LoaderReturnType>();
  const { title, content, attributeValues } = featuredEvent;
  return (
    <section id="featured-event">
      <div className="ml-auto w-[95vw] min-[1600px]:w-[90vw] bg-white relative hidden md:block">
        <div
          style={{ backgroundImage: `url(${attributeValues.image.value})` }}
          className={cn(
            "bg-cover bg-no-repeat",
            "md:bg-[right_0px_top_-80px]",
            "lg:bg-[right_0px_top_-200px]"
          )}
        >
          <div className="relative inline-flex flex-col gap-4 bg-white p-12 z-10 lg:-ml-12 top-50">
            <span className="text-ocean font-extrabold text-lg block">
              Featured Event
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <div className="text-text-secondary mb-8 max-w-[490px] line-clamp-4">
              <HTMLRenderer html={content || ""} stripFormattingTags />
            </div>
            <IconButton
              to={`/events/${attributeValues.url.value}`}
              withRotatingArrow
              className="bg-white border-neutral-default text-neutral-dark hover:enabled:bg-soft-white hover:enabled:text-neutral-dark"
              aria-label={`Learn more about ${attributeValues.campus?.value}`}
            >
              Learn More
            </IconButton>
          </div>
        </div>
      </div>
      <div className="w-full h-80 bg-gray hidden md:block" />
      {/* Mobile */}
      <div className="w-full bg-gray content-padding relative block md:hidden py-20">
        <Link to={`/events/${attributeValues.url.value}`}>
          <div className="max-w-screen-content mx-auto rounded-3xl overflow-hidden transition-transform active:scale-95">
            <img
              src={attributeValues.image.value}
              alt={`Volunteers at ${attributeValues.campus?.value} event`}
              className="w-full object-cover max-h-44 sm:max-h-64"
            />
            <div className="flex flex-col py-10 gap-2 bg-white p-6 z-10">
              <span className="text-ocean font-extrabold text-sm block">
                Featured Event
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
              <div className="text-text-secondary text-pretty line-clamp-7 min-[500px]:line-clamp-4">
                <HTMLRenderer html={content || ""} stripFormattingTags />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
