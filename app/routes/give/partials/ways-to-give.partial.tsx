import Icon from "~/primitives/icon";
import { icons } from "~/lib/icons";
import { Link } from "react-router-dom";

export const WaysToGive = () => {
  return (
    <div className="w-full py-12 md:py-24 content-padding" id="give-other-ways">
      <div className="flex flex-col gap-16 items-center mx-auto max-w-screen-content">
        {/* Title */}
        <div className="flex flex-col gap-1 md:gap-2 items-center text-center">
          <h2 className="text-[32px] md:text-[52px] font-extrabold leading-tight">
            Other Ways to Give
          </h2>
          <div className="bg-ocean w-[160px] md:w-[265px] h-2 rounded-[8px]" />
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16">
          {otherWaysToGiveData.map((item, index) => (
            <Card key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({
  title,
  description,
  ctas,
}: {
  title: string;
  description: string;
  ctas?: {
    icon: keyof typeof icons;
    href: string;
  }[];
}) => {
  return (
    <div className="w-full max-w-[434px] flex flex-col gap-2 md:gap-4 items-center text-center">
      <h3 className="text-2xl md:text-[32px] font-extrabold leading-tight">
        {title}
      </h3>
      <p
        className="leading-tight text-text-secondary md:text-lg"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {ctas && (
        <div className="flex gap-2 items-center justify-center">
          {ctas.map((cta, index) => (
            <Link
              key={index}
              to={cta.href}
              target="_blank"
              className={`${cta.icon === "appleLogo" ? "md:hidden" : ""}`}
            >
              <Icon
                name={cta.icon}
                className="size-8 md:size-[46px] text-ocean"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const otherWaysToGiveData: {
  title: string;
  description: string;
  ctas?: {
    icon: keyof typeof icons;
    href: string;
  }[];
}[] = [
  {
    title: "Other Online Options",
    description:
      "Online gifts given through ApplePay, Cash App, or Venmo cannot be designated to a specific fund or campus and will not be on your End-of-Year Giving Statement.",
    ctas: [
      {
        icon: "paypal",
        href: "https://www.paypal.com/paypalme/ChristFellowshipFL",
      },
      {
        icon: "venmo",
        href: "https://account.venmo.com/u/Christ-Fellowship",
      },
      // {
      //   icon: "appleLogo",
      //   href: "https://apple.com/apple-pay",
      // },
    ],
  },
  {
    title: "Cash or Check",
    description:
      "Give at any Christ Fellowship location or mail to: <br/><br/> <span class='italic md:not-italic'>Christ Fellowship Church Contributions<br/> 5343 Northlake Blvd.Palm Beach Gardens, FL 33418</span>",
  },
  {
    title: "Stocks, bonds, crypto, and other assets",
    description:
      "To give by stock, bond, or crypto currency please contact us.",
  },
];
