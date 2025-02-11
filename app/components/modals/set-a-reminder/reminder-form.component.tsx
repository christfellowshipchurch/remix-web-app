import * as Form from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import { Button } from "~/primitives/button/button.primitive";
import { defaultTextInputStyles } from "~/primitives/inputs/text-field/text-field.primitive";
import { useFetcher, useLoaderData } from "react-router";
import { LoaderReturnType } from "~/routes/locations/locationSingle/loader";
import { renderInputField } from "../connect-card/connect-form.component";

interface ReminderProps {
  setServiceTime: (time: string) => void;
  onSuccess: () => void;
}

const ReminderForm: React.FC<ReminderProps> = ({
  setServiceTime,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    name: campus,
    serviceTimes,
    user,
  } = useLoaderData<LoaderReturnType>(); // grabs campus information from the current page were on
  const isEspanol = campus?.includes("Español");

  const firstName = user?.fullName?.split(" ")[0] || null;
  const lastName = user?.fullName?.split(" ")[1] || null;
  const phoneNumber = user?.phoneNumber || null;
  const email = user?.email || null;

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setLoading(false);
      const data = fetcher.data as { error?: string };
      if (data.error) {
        setError(data.error);
      } else {
        onSuccess();
      }
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append("campus", campus); //ensure campus is included in the form data

    try {
      fetcher.submit(formData, {
        method: "post",
        action: "/set-a-reminder",
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

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
          firstName || null
        )}
        {renderInputField(
          "lastName",
          isEspanol ? "Apellido" : "Last Name",
          "text",
          isEspanol
            ? "Porfavor ingrese su apellido"
            : "Please enter your last name",
          lastName || null
        )}
        {renderInputField(
          "phone",
          isEspanol ? "Númbero de teléfono" : "Phone",
          "number",
          isEspanol
            ? "Porfavor ingrese un número de teléfono válido"
            : "Please enter a valid number",
          phoneNumber || null
        )}
        {renderInputField(
          "email",
          isEspanol ? "Correo electrónico" : "Email",
          "text",
          isEspanol
            ? "Porfavor ingrese un correo electrónico válido"
            : "Please enter a valid email",
          email || null
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
              <option>{campus}</option>
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
                {serviceTimes.map(({ hour }) =>
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
