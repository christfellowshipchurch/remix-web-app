import { useLoaderData } from "@remix-run/react";
import { LoaderReturnType } from "./loader";
import ConnectCardForm from "~/components/modals/connect-card/form";
import { useState } from "react";

export { action } from "./action";
export { loader } from "./loader";

export default function ConnectCardFormPage() {
  const [success, setSuccess] = useState(false);
  const formFieldData = useLoaderData<LoaderReturnType>();

  return (
    <div className="p-32">
      {success ? (
        <>Success!</> // Insert confirmation message here
      ) : (
        <ConnectCardForm
          campuses={formFieldData.campuses}
          checkboxes={formFieldData.allThatApplies}
          onSuccess={() => setSuccess(true)}
        />
      )}
    </div>
  );
}
