import { Button } from "~/primitives/button/button.primitive";

export const EventBanner = ({ title }: { title: string }) => {
  const buttonStyles =
    "bg-navy hover:bg-ocean text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0";

  return (
    <div className="w-full bg-white content-padding py-[15px] shadow-md sticky top-0">
      <div className="max-w-screen-content mx-auto w-full flex items-center justify-between">
        <p>{title}</p>

        <div className="hidden md:flex gap-2">
          <Button intent="primary" href="#about" className={`${buttonStyles}`}>
            About
          </Button>
          <Button intent="primary" href="#faq" className={`${buttonStyles}`}>
            FAQ
          </Button>
          <Button
            intent="primary"
            href="#register"
            className={`${buttonStyles}`}
          >
            Register
          </Button>
        </div>

        <Button intent="primary" className={`${buttonStyles}`}>
          Save My Spot
        </Button>
      </div>
    </div>
  );
};
