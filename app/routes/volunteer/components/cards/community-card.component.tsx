import { Link } from "react-router";
import { Button } from "~/primitives/button/button.primitive";
import { CommunityCard as CommunityCardType } from "../../types";

export const CommunityCard = ({ title, image, ctas }: CommunityCardType) => {
  return (
    <div className="rounded-[28px] p-6 shrink-0 w-[85vw] md:w-[446px] h-[190px] md:h-[268px] flex items-center justify-center relative overflow-hidden">
      <img
        src={image}
        alt={title}
        className="size-full absolute z-1 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent z-2" />
      <div className="flex flex-col gap-8 absolute bottom-0 left-0 w-full p-8 z-3">
        <h3 className="text-2xl font-extrabold md:text-[28px] text-white leading-tight">
          {title}
        </h3>
        <div className="flex gap-4">
          {ctas.map((cta, index) => (
            <Link
              to={cta.href}
              className={`text-primary-dark ${
                index === 0 ? "block" : "hidden md:block"
              }`}
              key={index}
            >
              <Button
                intent="secondary"
                className="w-full border-transparent bg-white/32 hover:!bg-white/20 text-white transition-all duration-300"
              >
                {cta.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
