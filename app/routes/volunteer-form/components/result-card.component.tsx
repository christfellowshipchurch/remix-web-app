import Icon from "~/primitives/icon";
import { icons } from "~/lib/icons";
import type { VolunteerResultCardProps } from "../types";
import { cn } from "~/lib/utils";

export const ResultCard = ({
  icon,
  image,
  title,
  description,
  experience,
  availability,
  passion,
  cta,
  ctaType = "primary",
  className,
}: VolunteerResultCardProps) => {
  const qualifications: {
    icon: keyof typeof icons;
    title: string;
    description: string;
  }[] = [
    {
      icon: "breifcase",
      title: "Your Experience",
      description: experience,
    },
    {
      icon: "timeFive",
      title: "Your Availability",
      description: availability,
    },
    {
      icon: "heart",
      title: "Your Passion",
      description: passion,
    },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white rounded-xl shadow-lg overflow-hidden",
        "w-full max-w-xs min-w-xs md:max-w-sm md:min-w-sm mx-auto",
        className
      )}
    >
      <img src={image} alt="" className="h-36 w-full object-cover" />
      <div className="absolute top-4 left-4 bg-ocean rounded-full p-2 shadow-lg">
        <Icon name={icon} className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col items-center flex-1 p-6">
        <h4 className="heading-h4 text-navy mb-2">{title}</h4>
        <p className="text-text-secondary mb-8 text-center">{description}</p>
        {qualifications.map((qualification) => (
          <div className="mb-2" key={qualification.title}>
            <div className="flex items-center gap-4 border-1 border-neutral-lighter rounded-lg px-4 py-2">
              <Icon
                //todo: check why icon sizing is not consistent
                size={qualification.icon === "timeFive" ? 32 : 42}
                name={qualification.icon}
                className="text-ocean"
              />
              <div className="flex flex-col">
                <span className="font-bold">{qualification.title}</span>
                <div className="text-sm">{qualification.description}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6">
          <button
            className={cn(
              "w-50 mt-2 py-2 rounded font-semibold",
              ctaType === "primary"
                ? "bg-ocean text-white hover:bg-ocean/90 transition-colors"
                : "bg-gray-200 text-ocean cursor-default"
            )}
            disabled={ctaType === "secondary"}
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
};

export type { VolunteerResultCardProps };
