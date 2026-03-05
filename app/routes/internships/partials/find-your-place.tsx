import { Button } from "~/primitives/button/button.primitive";

const FindYourPlace = () => {
  return (
    <section className="content-padding pt-30 pb-25 bg-white">
      <div className="max-w-screen-content mx-auto w-full flex flex-col items-center text-center gap-[28px] text-dark-navy">
        <h3 className="font-bold text-[32px] lg:text-[44px] max-w-[850px] leading-[1.05]">
          Ready to Find Your Place?
        </h3>
        <p className="max-w-[540px] text-neutral-default">
          Take the first step toward discovering your calling. Choose the
          program that’s right for you and start your application today.
        </p>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <Button
            intent="primary"
            className="w-fit bg-dark-navy hover:!bg-ocean min-w-[80px] min-h-[30px] px-5 py-3 rounded-[52px]"
          >
            Summer Internships
          </Button>
          <Button
            intent="primary"
            className="w-fit min-w-[80px] min-h-[30px] px-5 py-3 rounded-[52px]"
          >
            College Internships
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FindYourPlace;
