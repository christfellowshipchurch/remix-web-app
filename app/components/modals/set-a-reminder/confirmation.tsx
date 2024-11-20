import Button from "~/primitives/button";
import Icon from "~/primitives/icon";

const ReminderConfirmation = () => {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Icon name="check" color="#1ec27f" />
      <h1 className="font-bold text-2xl">You're all set!</h1>
      <Button intent="primary" className="rounded-xl">
        Continue
      </Button>
    </div>
  );
};

export default ReminderConfirmation;
