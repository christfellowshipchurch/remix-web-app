import { Button } from "~/primitives/button/button.primitive";

export const HeroCard = ({
  image,
  cta,
}: {
  image: string;
  cta: { label: string; href: string };
}) => {
  return (
    <div className={`flex flex-col items-center gap-4 w-[282px]`}>
      <img
        src={image}
        alt={cta.label}
        className={`rounded-[14px] min-w-[282px] aspect-square object-cover`}
      />
      <Button href={cta.href}>{cta.label}</Button>
    </div>
  );
};
