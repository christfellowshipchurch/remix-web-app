import { cn } from "~/lib/utils";

const InternshipFeatureSection = ({
  imageRight = false,
  title = "",
  description = "",
  images = [],
}: {
  imageRight?: boolean;
  title?: string;
  description?: string;
  images?: string[];
}) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center md:flex-row gap-4 md:gap-8 lg:gap-12 xl:gap-16",
        {
          "md:flex-row-reverse": imageRight,
        },
        {
          "md:justify-between": !imageRight,
        },
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-3 w-full md:max-w-[524px]",
          images.length > 1 && "md:grid-cols-2",
        )}
      >
        {images.map((image) => (
          <img
            src={image}
            alt="Internship Feature Section"
            className={cn("flex-1 w-full object-cover bg-center rounded-xl")}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[528px]">
        <h2 className="text-dark-navy font-semibold text-[40px] leading-[1.05]">
          {title}
        </h2>
        <p className="text-dark-navy leading-[1.1]">{description}</p>
      </div>
    </section>
  );
};

export default InternshipFeatureSection;
