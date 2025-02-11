import { Button } from "~/primitives/button/button.primitive";

const GroupConnectConfirmation = ({ onSuccess }: { onSuccess: () => void }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="font-bold text-2xl text-navy">Request has been sent!</h1>
      <p>Your group leader will reach out to you shortly!</p>
      <Button
        intent="primary"
        className="rounded-xl w-52"
        onClick={() => {
          onSuccess();
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default GroupConnectConfirmation;
