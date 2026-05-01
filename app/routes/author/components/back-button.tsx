import { Icon } from "~/primitives/icon/icon";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-3 text-base font-semibold transition-colors hover:text-ocean hover:cursor-pointer flex gap-2 items-center justify-center"
    >
      <Icon name="arrowBack" className="mb-[2px]" size={16} /> Back
    </button>
  );
}
