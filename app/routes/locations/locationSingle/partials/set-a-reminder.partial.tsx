import SetAReminderModal from "~/components/modals/set-a-reminder";
import Button from "~/primitives/button";
import Modal from "~/primitives/Modal";
import Video from "~/primitives/Video";

export const SetAReminder = () => {
  return (
    <div
      className="flex w-full justify-center bg-[#F5F5F7] py-16 lg:py-20"
      id="set-a-reminder"
    >
      <div className="flex max-w-[1240px] flex-col items-center lg:gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-wordOfChrist">
            Set a Reminder for an Upcoming Service
          </h1>
          <p className="max-w-[90vw] pt-6 text-lg leading-6 md:max-w-[80vw] lg:max-w-[800px]">
            Attending church for the first time has never been easier. We’ve
            created a simple way for you to schedule a visit and receive a
            reminder. Here’s how to do it.
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 lg:mx-8 lg:flex-row lg:items-start xl:gap-20">
          <div className="mt-8 w-[90vw] overflow-hidden rounded-lg md:w-[80vw] lg:mt-0 lg:max-w-[760px] xl:w-[820px]">
            {/* TODO: Setup Wistia Videos */}
            <Video wistiaId="hokgxn0k8r" className="rounded-lg" />
          </div>
          {/* Desktop */}
          <div className="hidden h-full flex-col justify-center gap-6 lg:flex">
            <div className="flex max-w-[280px] items-start gap-5">
              <img
                src="/icons/cotton-candy-pencil.svg"
                alt="icon"
                width={28}
                height={28}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-bold leading-5">Step 1</h3>
                <p>
                  Fill out your information and select the service you plan to
                  attend.
                </p>
              </div>
            </div>
            <div className="flex max-w-[280px] items-start gap-5">
              <img
                src="/icons/cotton-candy-bell.svg"
                alt="icon"
                width={28}
                height={28}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-bold leading-5">Step 2</h3>
                <p>Receive a friendly reminder so you don’t miss service.</p>
              </div>
            </div>
            <div className="flex max-w-[280px] items-start gap-5">
              <img
                src="/icons/cotton-candy-bible.svg"
                alt="icon"
                width={28}
                height={28}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-bold leading-5">Step 3</h3>
                <p>
                  Attend a Sunday service and start living the life you were
                  created for.
                </p>
              </div>
            </div>
            {/* TODO: Add On Clicks */}
            <Modal>
              <Modal.Button asChild>
                <Button
                  intent="secondary"
                  size="sm"
                  className="ml-[47px] mt-2 hidden h-auto w-[170px] rounded-lg lg:block"
                >
                  Set a Reminder
                </Button>
              </Modal.Button>
              <Modal.Content title="Modal Title">
                <SetAReminderModal />
              </Modal.Content>
            </Modal>
          </div>
          {/* Mobile */}
          <Modal>
            <Modal.Button asChild>
              <Button
                intent="primary"
                className="h-auto w-[90vw] rounded-lg md:w-[360px] lg:hidden"
              >
                Set a Reminder
              </Button>
            </Modal.Button>
            <Modal.Content title="Modal Title">
              <SetAReminderModal />
            </Modal.Content>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default SetAReminder;
