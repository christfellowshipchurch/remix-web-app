export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-3 text-base font-semibold transition-colors hover:text-ocean hover:cursor-pointer"
    >
      {"< Back"}
    </button>
  );
}
