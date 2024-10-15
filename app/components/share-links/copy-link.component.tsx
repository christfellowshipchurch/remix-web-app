const CopyToClipboard = ({
  textToCopy,
  children,
}: {
  children: React.ReactNode;
  textToCopy: string | null;
}) => {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(textToCopy || "");
      }}
    >
      {children}
    </button>
  );
};

export default CopyToClipboard;
