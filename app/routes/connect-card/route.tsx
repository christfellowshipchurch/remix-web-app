import { useState } from "react";
import ConnectCardForm from "~/components/modals/connect-card/connect-form.component";
import ConnectCardConfirmation from "~/components/modals/connect-card/confirmation.component";

export { action } from "./action";
export { loader } from "./loader";

export default function ConnectCardFormPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 max-w-screen-sm mx-auto">
      {isSuccess ? (
        <ConnectCardConfirmation />
      ) : (
        <ConnectCardForm onSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  );
}
