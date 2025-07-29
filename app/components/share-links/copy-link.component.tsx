import { useState } from "react";
import { Tooltip } from "~/primitives/tooltip";

const CopyToClipboard = ({
  textToCopy,
  children,
}: {
  children: React.ReactNode;
  textToCopy: string | null;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy || "");
      setShowTooltip(true);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Tooltip
      content="Link copied!"
      position="top"
      show={showTooltip}
      onShowChange={setShowTooltip}
    >
      <button onClick={handleCopy} className="cursor-pointer">
        {children}
      </button>
    </Tooltip>
  );
};

export default CopyToClipboard;
