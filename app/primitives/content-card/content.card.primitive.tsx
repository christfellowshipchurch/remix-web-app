import Icon from "~/primitives/icon";
import { icons } from "~/lib/icons";
import { Link } from "react-router";
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
    <div className="flex flex-col gap-5 col-span-1 w-full h-full max-w-[430px]">
      <div className="flex flex-col gap-1">
        <img
          src={image}
          alt={title}
          className="w-full aspect-[4/3] object-cover rounded-lg"
          loading="lazy"
        />
        <ul className="flex gap-3 pt-1">
          {subheadings.map((subheading, index) => (
            <li key={index} className="flex gap-1">
              {subheading.icon && (
                <Icon name={subheading.icon} color="#666666" />
              )}
              <p className="font-medium text-text-secondary">
                {subheading.title}
              </p>
            </li>
          ))}
        </ul>
        <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <h3 className="font-extrabold text-[28px] leading-8 text-pretty">
          {title}
        </h3>
        <Link
          to={cta.href}
          className="font-bold mt-2 hover:text-ocean"
          prefetch="intent"
        >
          <span className="underline">{cta.title}</span>
        </Link>
      </div>
    </div>
  );
};
