import { cn } from "~/lib/utils";

const InternshipFeatureSection = ({
  imageRight = false,
  alignRight,
  title = "",
  description = "",
  images = [],
}: {
  imageRight?: boolean;
  alignRight?: boolean;
  title?: string;
  description?: string;
  images?: string[];
  imageAlt?: string;
}) => {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center md:flex-row bg-ocean-subdued rounded-[20px] px-4 pt-6 pb-10 md:p-6 lg:p-12 mb-4 md:my-5 gap-18 max-w-[1044px]",
        {
          "md:flex-row-reverse": imageRight,
          "lg:ml-auto": alignRight,
          "lg:mr-auto": !alignRight,
        }
      )}
    >
      <div>
        {images.map((image) => (
          <img
            src={image}
            alt="Internship Feature Section"
            className={cn(
              "w-full object-cover rounded-xl",
              images.length > 1
                ? "md:max-w-[150px] lg:max-w-[256px]"
                : "md:max-w-[301px] lg:max-w-[435px]"
            )}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h2 className="text-dark-navy font-semibold text-[40px] leading-[1.05]">
          {title}
        </h2>
        <p className="text-dark-navy leading-[1.1]">{description}</p>
      </div>
    </section>
  );
};

export default InternshipFeatureSection;
