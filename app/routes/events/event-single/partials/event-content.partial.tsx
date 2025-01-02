export const EventContent = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-[38px]">
        <h2 className="font-extrabold text-4xl">What To Expect</h2>
        <p>Details about what to expect at the event will go here.</p>
      </div>
      {/* Content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};
