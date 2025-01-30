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
          className="w-full h-48 object-cover"
          loading="lazy"
        />{" "}
        <ul className="flex gap-3 pt-1">
          {subheadings.map((subheading, index) => (
            <li key={index} className="flex gap-1">
              {subheading.icon && (
                <Icon name={subheading.icon} color="#666666" />
              )}
              <p className="font-medium text-[#666666]">{subheading.title}</p>
            </li>
          ))}
        </ul>
        <div className="h-[2px] w-full bg-[#4E4E4E]/20" />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <h3 className="font-extrabold text-3xl leading-8">{title}</h3>
        <Link
          to={cta.href}
          className="font-bold underline mt-2"
          prefetch="intent"
        >
          {cta.title}
        </Link>
      </div>
    </div>
  );
};
