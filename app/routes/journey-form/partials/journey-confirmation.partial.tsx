export const JourneyConfirmation: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center p-12 bg-white rounded-[1rem] shadow-md w-full max-w-xl gap-8 mb-24">
      <h1 className="text-[36px] font-extrabold leading-tight">
        You're all set!
      </h1>
      <p className="text-sm text-secondary">
        Check your email for more details about your upcoming Journey class.
      </p>
    </section>
  );
};

export default JourneyConfirmation;
