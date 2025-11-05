import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { useFetcher } from "react-router-dom";
import { renderInputField } from "../connect-card/connect-form.component";
import { LoaderReturnType } from "~/routes/set-a-reminder/loader";

interface ReminderProps {
  setServiceTime: (time: string) => void;
  onSuccess: () => void;
  url: string;
}

const ReminderForm: React.FC<ReminderProps> = ({
  setServiceTime,
  onSuccess,
  url,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoaderReturnType | null>(null);

  const loadFetcher = useFetcher();
  const submitFetcher = useFetcher();

  useEffect(() => {
    loadFetcher.load(`/set-a-reminder?location=${url}`);
  }, [url]);

  useEffect(() => {
    if (loadFetcher.state === "idle" && loadFetcher.data) {
      const data = loadFetcher.data as LoaderReturnType;
      setFormData(data);
    }
  }, [loadFetcher.state, loadFetcher.data]);

  useEffect(() => {
    if (submitFetcher.state === "idle" && submitFetcher.data) {
      setLoading(false);
      const data = submitFetcher.data as { error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        onSuccess();
      }
    }
  }, [submitFetcher.state, submitFetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append("campus", campusName || ""); //ensure campus is included in the form data

    try {
      submitFetcher.submit(formData, {
        method: "post",
        action: "/set-a-reminder",
      });
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  const { serviceTimes, campusName, user } = formData || {};
  const isEspanol = campusName?.includes("Español");
  const firstName = user?.firstName || null;
  const lastName = user?.lastName || null;
  const phoneNumber = null;
  const email = user?.email || null;

  return (
    <>
      <h2 className="mb-6 text-3xl text-navy font-bold">
        {isEspanol ? "Recuérdame" : "Set A Reminder!"}
      </h2>
      <Form.Root
        onSubmit={handleSubmit}
        className="flex flex-col md:grid text-left grid-cols-1 gap-y-3 gap-x-6 md:grid-cols-2"
      >
        {renderInputField(
          "firstName",
          isEspanol ? "Primer nombre" : "First Name",
          "text",
          isEspanol
            ? "Profavor ingrese su primer nombre"
            : "Please enter your first name",
          firstName || undefined
        )}
        {renderInputField(
          "lastName",
          isEspanol ? "Apellido" : "Last Name",
          "text",
          isEspanol
            ? "Porfavor ingrese su apellido"
            : "Please enter your last name",
          lastName || undefined
        )}
        {renderInputField(
          "phone",
          isEspanol ? "Númbero de teléfono" : "Phone",
          "number",
          isEspanol
            ? "Porfavor ingrese un número de teléfono válido"
            : "Please enter a valid number",
          phoneNumber || undefined
        )}
        {renderInputField(
          "email",
          isEspanol ? "Correo electrónico" : "Email",
          "text",
          isEspanol
            ? "Porfavor ingrese un correo electrónico válido"
            : "Please enter a valid email",
          email || undefined
        )}

        <Form.Field name="campus" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">Campus</Form.Label>
          <Form.Control asChild>
            <select
              className={`appearance-none ${defaultTextInputStyles} text-neutral-400`}
              required
              disabled
              style={{
                backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                backgroundSize: "24px",
                backgroundPosition: "calc(100% - 2%) center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <option>{campusName}</option>
            </select>
          </Form.Control>
        </Form.Field>

        <Form.Field name="serviceTime" className="flex flex-col">
          <Form.Label className="font-bold text-sm mb-2">
            {isEspanol ? "Horarios de Servicios" : "Service Time"}
          </Form.Label>
          <Form.Control asChild>
            {serviceTimes && (
              <select
                className={`appearance-none ${defaultTextInputStyles} cursor-pointer`}
                required
                onChange={(e) => setServiceTime(e.target.value)}
                style={{
                  backgroundImage: `url('/assets/icons/chevron-down.svg')`,
                  backgroundSize: "24px",
                  backgroundPosition: "calc(100% - 2%) center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value={""}>
                  {isEspanol
                    ? "Seleccione un horario de servicio"
                    : "Select a Service Time"}
                </option>
                {serviceTimes?.map(({ hour }) =>
                  hour.map((time: string, index: number) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))
                )}
              </select>
            )}
          </Form.Control>
          <Form.Message className="text-sm text-alert" match="valueMissing">
            {isEspanol
              ? "Porfavor seleccione un horario de servicio"
              : "Please select a service time"}
          </Form.Message>
        </Form.Field>

        {error && <p className="text-alert col-span-2 text-center">{error}</p>}

        <Form.Submit className="mt-6 mx-auto col-span-1 md:col-span-2" asChild>
          <Button
            className="w-40 h-12"
            size="md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : isEspanol ? "Enviar" : "Submit"}
          </Button>
        </Form.Submit>
      </Form.Root>
    </>
  );
};

export default ReminderForm;
