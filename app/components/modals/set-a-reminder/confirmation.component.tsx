import { useLoaderData } from "@remix-run/react";
import { icsLink, icsLinkEvents } from "~/lib/utils";
import Button from "~/primitives/button";
import Icon from "~/primitives/icon";
import { LoaderReturnType } from "~/routes/locations/locationSingle/loader";

const ReminderConfirmation = ({
  serviceTime,
  onSuccess,
}: {
  serviceTime: string;
  onSuccess: () => void;
}) => {
  const { name, street1, city, state, postalCode, url } =
    useLoaderData<LoaderReturnType>();
  const campusAddress = [street1, city, state, postalCode.substring(0, 5)].join(
    ", "
  );
  const events = icsLinkEvents(
    [{ day: "Sunday", time: serviceTime }],
    campusAddress,
    name,
    `https://christfellowship.church/locations/${url}`
  );
  const isEspanol = name?.includes("Español");

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Icon name="check" size={96} color="#1ec27f" />
      <h2 className="font-bold text-2xl text-navy">
        {isEspanol
          ? "Asegúrese de revisar su correo electrónico para obtener más detalles y nos vemos este domingo."
          : "Be sure to check out your email for more details and we'll see you this Sunday!"}
      </h2>
      <div className="flex gap-2 mt-4">
        <Button
          href={icsLink(events[0].event)}
          intent="secondary"
          className="rounded-xl w-full"
        >
          {isEspanol ? "Añadir al Calendario" : "Add to Calendar"}
        </Button>
        <Button
          intent="primary"
          className="rounded-xl w-52"
          onClick={() => {
            onSuccess();
          }}
        >
          {isEspanol ? "Continuar" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default ReminderConfirmation;
