import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

const OnDemandCard = ({ title, image }: { title: string; image: string }) => {
  return (
    <div className="w-full flex rounded-[8px] bg-white shadow-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-1/2 max-w-[320px] aspect-video object-cover"
      />
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-3">
          <SelfPacedPill />
          <h2 className="text-2xl font-bold w-full">{title} On Demand</h2>
          <p className="text-neutral-default">
            Work through this class at your own pace with guided content and
            practical steps you can apply right away.
          </p>
        </div>

        <Button intent="primary" className="w-fit gap-2">
          <p>Start Class</p> <Icon name="arrowRight" />
        </Button>
      </div>
    </div>
  );
};

const SelfPacedPill = () => {
  return (
    <p className="bg-ocean/10 text-ocean w-fit flex items-center justify-center rounded-[4px] text-xs font-semibold px-2 py-0.75">
      Self-Paced
    </p>
  );
};

export default OnDemandCard;
