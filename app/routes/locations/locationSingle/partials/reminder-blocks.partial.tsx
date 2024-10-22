import SetAReminderModal from "~/components/modals/set-a-reminder";
import Button from "~/primitives/button";
import Modal from "~/primitives/Modal";

export const CfEveywhereSetReminder = () => {
  // TODO: Update icons to white versions
  const stepsData = [
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description:
        "Fill out your information and select the service you plan to attend.",
    },
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description: "Receive a friendly reminder so you don’t miss service.",
    },
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description:
        "Attend a Sunday service and start living the life you were created for.",
    },
  ];

  return (
    <>
      {/* Desktop */}
      <div className="lg:flex hidden flex-col items-center gap-6">
        <div className="flex mt-6 gap-6 text-center">
          {stepsData.map((step, index) => (
            <div
              key={index}
              className="flex flex-col bg-primary rounded-md py-6 px-8 text-white max-w-[300px] items-center gap-5"
            >
              <img src={step.icon} alt="icon" width={28} height={28} />
              <div className="flex flex-col">
                <h3 className="text-xl font-bold leading-5">
                  Step {index + 1}
                </h3>
                <p className="mt-2">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* TODO: Add On Clicks */}
        <Modal>
          <Modal.Button asChild>
            <Button
              intent="secondary"
              size="sm"
              className="mt-2 hidden h-auto w-[170px] rounded-lg lg:block"
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
      <div className="flex flex-col items-center text-center lg:hidden gap-6 mt-8">
        {stepsData.map((step, index) => (
          <div
            key={index}
            className="flex flex-col bg-primary rounded-md p-8 text-white max-w-[320px] items-center gap-3"
          >
            <img src={step.icon} alt="icon" width={28} height={28} />
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold leading-5">Step {index + 1}</h3>
              <p className="mt-3">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal>
        <Modal.Button asChild>
          <Button
            intent="secondary"
            className="h-auto w-[90vw] mt-4 rounded-lg md:w-[360px] lg:hidden"
          >
            Set a Reminder
          </Button>
        </Modal.Button>
        <Modal.Content title="Modal Title">
          <SetAReminderModal />
        </Modal.Content>
      </Modal>
    </>
  );
};

export const DefaultSetReminder = () => {
  const stepsData = [
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description:
        "Fill out your information and select the service you plan to attend.",
    },
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description: "Receive a friendly reminder so you don’t miss service.",
    },
    {
      icon: "/icons/cotton-candy-pencil.svg",
      description:
        "Attend a Sunday service and start living the life you were created for.",
    },
  ];

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full flex-col justify-center gap-6 lg:flex">
        {stepsData.map((step, index) => (
          <div className="flex max-w-[280px] items-start gap-5">
            <img src={step.icon} alt="icon" width={28} height={28} />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold leading-5">Step {index + 1}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
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
            className="h-auto w-[90vw] mt-4 rounded-lg md:w-[360px] lg:hidden"
          >
            Set a Reminder
          </Button>
        </Modal.Button>
        <Modal.Content title="Modal Title">
          <SetAReminderModal />
        </Modal.Content>
      </Modal>
    </>
  );
};
