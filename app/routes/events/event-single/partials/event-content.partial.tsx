export const EventContent = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div className="w-4/5">
      <h2>What to Expect</h2>
      <p>Details about what to expect at the event will go here.</p>
      {/* Content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};
