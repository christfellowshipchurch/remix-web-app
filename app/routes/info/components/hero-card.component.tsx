import { Button } from "~/primitives/button/button.primitive";

export const HeroCard = ({
  image,
  cta,
  size = "normal",
}: {
  image: string;
  cta: { label: string; href: string };
  size?: "normal" | "large";
}) => {
  const cardWidth = size === "large" ? "w-[350px]" : "w-[282px]";
  const imageWidth = size === "large" ? "min-w-[350px]" : "min-w-[282px]";

  return (
    <div className={`flex flex-col items-center gap-4 ${cardWidth}`}>
      <img
        src={image}
        alt={cta.label}
        className={`rounded-[14px] ${imageWidth} aspect-square object-cover`}
      />
      <Button href={cta.href}>{cta.label}</Button>
    </div>
  );
};
