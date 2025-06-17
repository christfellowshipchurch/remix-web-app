import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { icsLink, icsLinkEvents } from "~/lib/utils";
import { Button } from "~/primitives/button/button.primitive";
import Icon from "~/primitives/icon";
import { LoaderReturnType } from "~/routes/set-a-reminder/loader";

const ReminderConfirmation = ({
  serviceTime,
  onSuccess,
  campusUrl,
  location,
}: {
  serviceTime: string;
  onSuccess: () => void;
  campusUrl: string;
  location: string;
}) => {
  const [formData, setFormData] = useState<LoaderReturnType | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.load(`/set-a-reminder?location=${campusUrl}`);
  }, [campusUrl]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setFormData(fetcher.data as LoaderReturnType);
    }
  }, [fetcher.state, fetcher.data]);

  if (!formData) {
    return <div>Loading...</div>;
  }

  const { address, url } = formData;
  const events = icsLinkEvents({
    serviceTimes: [{ day: "Sunday", time: serviceTime }],
    address,
    campusName: location,
    url: `https://christfellowship.church/locations/${url}`,
  });
  const addToCalendarLink = icsLink(events[0].event);
  const isEspanol = location?.includes("Español");

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
          href={addToCalendarLink}
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
