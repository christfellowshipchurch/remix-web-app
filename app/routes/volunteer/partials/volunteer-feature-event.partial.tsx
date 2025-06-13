import { IconButton } from "~/primitives/button/icon-button.primitive";

interface VolunteerFeaturedEventProps {
  title?: string;
  subtitle?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export function VolunteerFeaturedEvent({
  title = "Dream Team Kickoff?",
  subtitle = "Featured Event",
  description = "We have many opportunities for you to volunteer from wherever you are—whether it's at your local campus, online with Christ Fellowship Everywhere, or with one of our central ministries out of the Palm Beach Gardens location. Find your spot on the Dream Team today.",
  url = "#todo",
  imageUrl = "/assets/images/volunteer/dream-team-kickoff.webp",
}: VolunteerFeaturedEventProps) {
  return (
    <section id="featured-event">
      <div className="w-full bg-white content-padding relative hidden md:block">
        <div className="max-w-screen-content mx-auto">
          <img
            src={imageUrl}
            alt={`Volunteers at ${title} event`}
            className="w-full h-[550px] object-cover shadow absolute inset-0 z-0 left-40"
          />
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
        </div>
      </div>
    </section>
  );
}
