const CopyToClipboard = ({
  textToCopy,
  children,
}: {
  children: React.ReactNode;
  textToCopy: string | null;
}) => {
  return (
    <>
      {/**
       * TODO : Add a confirmation message that link has been copied
       */}
      {/* <span className="absolute text-primary bg-white px-2 rounded">
        Copied to Clipboard
      </span> */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(textToCopy || "");
        }}
      >
        {children}
      </button>
    </>
  );
};

export default CopyToClipboard;
