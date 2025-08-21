import { Button } from "~/primitives/button/button.primitive";

export const WhyWeGive = () => {
  return (
    <div
      className="w-full py-12 md:py-15 bg-white content-padding"
      id="give-why-we-give"
    >
      <div className="flex flex-col gap-8 md:gap-12 items-center mx-auto max-w-[800px]">
        <div className="flex flex-col gap-4 md:gap-8 items-center text-center">
          <h2 className="text-[32px] md:text-[36px] font-bold leading-tight">
            Why We Give
          </h2>
          <p className="text-[17px] md:text-[22px] leading-tight">
            <span className="font-bold underline">
              We give because God is a giver.
            </span>{" "}
            His very heart and nature, as shown throughout Scripture, is
            generosity. Because we’re created in His image, we’re most like Him
            when we give and steward all that He has entrusted to us. When we
            give, it positions us to be the hands and feet of Jesus in our
            region and beyond.
          </p>
        </div>
        <Button href="#todo" size="md">
          LEARN MORE
        </Button>
      </div>
    </div>
  );
};
