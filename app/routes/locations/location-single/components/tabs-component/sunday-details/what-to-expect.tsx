import { SetAReminderModal } from "~/components";

export const WhatToExpect = ({
  setReminderVideo,
}: {
  setReminderVideo: string;
}) => {
  return (
    <div className="w-full rounded-t-[24px] md:rounded-none bg-gray pt-41 pb-28 content-padding flex justify-center">
      <div className="w-ful flex flex-col lg:flex-row gap-12 xl:gap-20 items-center justify-center max-w-screen-content mx-auto">
        {/* Left Side */}
        <div className="flex-1 w-full lg:flex-auto lg:w-5/7 xl:w-4/7">
          <iframe
            src={`https://fast.wistia.net/embed/iframe/${setReminderVideo}?fitStrategy=cover`}
            className="w-full h-[414px] aspect-73/41 rounded-[1rem]"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-1 w-full lg:flex-auto lg:w-3/7 xl:w-3/7 flex-col gap-6 lg:max-w-[616px]">
          <h2 className="font-extrabold text-[24px] md:text-[36px] lg:text-[52px]">
            What to Expect
          </h2>
          <div className="flex flex-col gap-6">
            <ExpectItem
              title="Come As You Are, Seriously!"
              description="Comfortable clothes are the norm - no need to dress up to check us out."
            />
            <ExpectItem
              title="Real Talk, Real Life (in about 1 hour)"
              description="Engaging and thought-provoking messages based on the Bible that connect with everyday challenges and questions."
            />
            <ExpectItem
              title="Friendly Faces, Easy Welcome."
              description="We're here to help you feel comfortable from the moment you arrive."
            />
            <ExpectItem
              title="Kids Have Fun Too! "
              description="Safe and engaging programs available for newborns through 5th grade during the service."
            />

            <div className="flex">
              <SetAReminderModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpectItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};
