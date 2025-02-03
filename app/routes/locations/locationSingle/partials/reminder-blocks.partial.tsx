import { useLoaderData } from "react-router";
import SetAReminderModal from "~/components/modals/set-a-reminder";
import { Button } from "~/primitives/button/button.primitive";
import Modal from "~/primitives/Modal";
import { LoaderReturnType } from "../loader";
import { Icon } from "~/primitives/icon/icon";

export const CfEveywhereSetReminder = () => {
  const stepsData = [
    {
      icon: <Icon name="pencil" color="white" size={32} />,
      description:
        "Fill out your information and select the service you plan to attend.",
    },
    {
      icon: <Icon name="bell" color="white" size={32} />,
      description: "Receive a friendly reminder so you don’t miss service.",
    },
    {
      icon: <Icon name="bible" color="white" size={32} />,
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
              className="flex flex-col bg-ocean rounded-md py-6 px-8 text-white max-w-[300px] items-center gap-5"
            >
              {step?.icon}
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
          <Modal.Content title="Set a Reminder">
            <SetAReminderModal />
          </Modal.Content>
        </Modal>
      </div>

      {/* Mobile */}
      <div className="flex flex-col items-center text-center lg:hidden gap-6 mt-8">
        {stepsData.map((step, index) => (
          <div
            key={index}
            className="flex flex-col bg-ocean rounded-md p-8 text-white max-w-[320px] items-center gap-3"
          >
            {step?.icon}
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
        <Modal.Content title="Set a Reminder">
          <SetAReminderModal />
        </Modal.Content>
      </Modal>
    </>
  );
};

export const DefaultSetReminder = () => {
  const { name } = useLoaderData<LoaderReturnType>();
  const isEspanol = name?.includes("Español");
  const stepsData = [
    {
      icon: <Icon name="pencil" size={32} color="#6BCABA" />,
      description: isEspanol
        ? "Completa tu información y selecciona el servicio al que planeas asistir."
        : "Fill out your information and select the service you plan to attend.",
    },
    {
      icon: <Icon name="bell" size={32} color="#6BCABA" />,
      description: isEspanol
        ? "Recibe un recordatorio para no perderte el servicio."
        : "Receive a friendly reminder so you don’t miss service.",
    },
    {
      icon: <Icon name="bible" size={32} color="#6BCABA" />,
      description: isEspanol
        ? "Asiste a un servicio de domingo y comienza a vivir la vida para la que fuiste creado."
        : "Attend a Sunday service and start living the life you were created for.",
    },
  ];
  const title = isEspanol ? "Recuérdame" : "Set a Reminder";

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full flex-col justify-center gap-6 lg:flex">
        {stepsData.map((step, index) => (
          <div key={index} className="flex items-start gap-5">
            {step?.icon}
            <div className="flex flex-col max-w-[250px]">
              <h3 className="text-xl font-bold leading-5">
                {isEspanol ? "Paso" : "Step"} {index + 1}
              </h3>
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
              {title}
            </Button>
          </Modal.Button>
          <Modal.Content title={title}>
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
            {title}
          </Button>
        </Modal.Button>
        <Modal.Content title={title}>
          <SetAReminderModal />
        </Modal.Content>
      </Modal>
    </>
  );
};
