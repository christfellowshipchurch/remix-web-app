import { useNavigate } from "react-router-dom";
import { Button } from "~/primitives/button/button.primitive";

export const YesWelcomePartial = () => {
  const navigate = useNavigate();

  // TODO:  Add Confetti animation
  return (
    <section className="flex justify-center w-full max-w-screen-content mx-auto">
      <div className="content-padding flex flex-col items-center text-center gap-6 w-full max-w-[900px] text-white mt-16 mb-28 lg:mt-32 lg:mb-50 xl:mt-48 xl:mb-82">
        <h1 className="text-[40px] lg:text-[52px] font-extrabold text-dark-navy leading-tight">
          <span className="text-white">Congratulations!</span> You just made{" "}
          <br />
          the best decision ever.
        </h1>
        <p className="lg:text-lg">
          As you begin your journey with Jesus, we want you to know that we are
          here to walk alongside you! Simply fill out this short form so we can
          help you get started!
        </p>

        <Button
          intent="white"
          className="w-fit text-navy mt-4 border-none"
          onClick={() => {
            navigate("/yes/about-you");
          }}
        >
          Let's get started!
        </Button>
      </div>
    </section>
  );
};

export default YesWelcomePartial;
