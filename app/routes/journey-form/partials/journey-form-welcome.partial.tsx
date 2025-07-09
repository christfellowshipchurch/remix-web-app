import React, { useEffect, useRef } from "react";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";

export const JourneyFormWelcome: React.FC<{ onSubmit: () => void }> = ({
  onSubmit,
}) => {
  return (
    <section className="flex flex-col items-center justify-center p-12 bg-white rounded-[1rem] shadow-md w-full max-w-xl gap-6 mb-24">
      <h1 className="font-extrabold text-[28px] w-full">
        We can't wait to see you at Journey!
      </h1>
      {/* Form */}

      <Button
        intent="primary"
        className="font-normal w-full max-w-lg"
        onClick={onSubmit}
        aria-label="Submit Journey Form"
      >
        Submit
      </Button>
    </section>
  );
};

export default JourneyFormWelcome;
