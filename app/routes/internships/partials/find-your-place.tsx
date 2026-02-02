import { Button } from "~/primitives/button/button.primitive";

const FindYourPlace = () => {
  return (
    <div className="content-padding w-full py-12">
      <div className="max-w-screen-content mx-auto w-full flex flex-col-reverse md:flex-row gap-5">
        <div className="flex-1 flex flex-col md:justify-center gap-10 p-6 md:p-12 lg:p-15 text-white rounded-[20px] bg-navy">
          <h2 className="text-[40px] font-bold leading-[1.05]">
            Find Your Place
          </h2>
          <p className="leading-[1.1]">
            Interns can discover their niche by engaging with others and
            building meaningful connections.
          </p>
          <Button
            intent="white"
            className="w-fit min-w-[80px] min-h-[30px] max-h-[42px] p-3 border-none font-semibold text-dark-navy rounded-[52px] "
          >
            Apply Now
          </Button>
        </div>

        <img
          src="/assets/images/internships/find-your-place.webp"
          alt="Find Your Place"
          className="w-full md:max-w-1/2 flex-1 aspect-video md:aspect-square lg:aspect-video object-cover rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default FindYourPlace;
