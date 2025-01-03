import Icon from "~/primitives/icon";
import { icons } from "~/lib/icons";
type IconName = keyof typeof icons;

/**
 * The Content Card is a primitive that is used for different types of content. This includes events, messages, and more. Depending on the type of content, the card will accept different props.
 */

type CardProps = {
  image: string;
  title: string;
  subheadings: { icon?: IconName; title: string }[];
  cta: {
    title: string;
    href: string;
  };
};

export const ContentCard = ({ image, title, subheadings, cta }: CardProps) => {
  return (
    <div className="flex flex-col gap-5 col-span-1 w-full max-w-[430px]">
      <div className="flex flex-col gap-1">
        <img src={image} className="w-[430px] h-[280px] object-cover" />
        <div className="flex gap-3 pt-1">
          {subheadings.map((subheading, index) => (
            <div key={index} className="flex gap-1">
              {subheading.icon && (
                <Icon name={subheading.icon} color="#666666" />
              )}
              <p className="font-medium text-[#666666]">{subheading.title}</p>
            </div>
          ))}
        </div>
        <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-extrabold text-3xl leading-8">{title}</h3>
        <a href={cta.href} className="font-bold underline">
          {cta.title}
        </a>
      </div>
    </div>
  );
};
