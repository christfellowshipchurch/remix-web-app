import { Button } from "~/primitives/button/button.primitive";

const StartWithUs = () => {
  return (
    <section className="content-padding pt-30 pb-25 bg-white">
      <div className="max-w-screen-content mx-auto w-full flex flex-col items-center text-center gap-[28px] text-dark-navy">
        <h2 className="font-medium text-[15px]">Start With Us</h2>
        <h3 className="font-bold text-[28px] md:text-[32px] lg:text-[52px] max-w-[850px] leading-[1.05]">
          Let us help you as you start out in your early career, and to shape
          your future for success.
        </h3>
        <p className="max-w-[620px]">
          Our internship program is designed to equip you with the skills,
          experience, and connections you need to thrive in your career and
          calling.
        </p>
        <Button
          intent="primary"
          className="w-fit bg-dark-navy hover:!bg-ocean min-w-[80] min-h-[30px] p-3 rounded-[52px]"
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
};

export default StartWithUs;
