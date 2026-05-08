import { useState } from 'react';
import { Tooltip } from '~/primitives/tooltip';
import { cn } from '~/lib/utils';

const CopyToClipboard = ({
  textToCopy,
  children,
  className,
}: {
  children: React.ReactNode;
  textToCopy: string | null;
  className?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy || '');
      setShowTooltip(true);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const tooltip = (
    <Tooltip
      content='Link copied!'
      position='top'
      rootClassName={
        className
          ? 'relative flex min-h-0 w-full flex-1 flex-col items-stretch'
          : undefined
      }
      show={showTooltip}
      onShowChange={setShowTooltip}
    >
      <button
        type='button'
        onClick={handleCopy}
        className={cn(
          'cursor-pointer',
          className &&
            'flex min-h-0 w-full flex-1 flex-col items-center justify-stretch',
        )}
      >
        {children}
      </button>
    </Tooltip>
  );

  if (className) {
    return (
      <div
        className={cn(
          'flex min-h-0 w-full flex-1 flex-col items-stretch',
          className,
        )}
      >
        {tooltip}
      </div>
    );
  }

  return tooltip;
};

export default CopyToClipboard;
