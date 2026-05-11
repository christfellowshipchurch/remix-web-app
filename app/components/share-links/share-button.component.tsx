import { ReactNode } from 'react';
import CopyToClipboard from './copy-link.component';
import { cn } from '~/lib/utils';

type ShareButtonProps = {
  children: ReactNode;
  shareMessage?: string;
  url?: string;
  title?: string;
  /** Applied to the native button trigger (share or copy fallback). */
  className?: string;
};

export const ShareButton = ({
  children,
  shareMessage = 'Come with me to a service at Christ Fellowship Church!',
  url,
  title,
  className,
}: ShareButtonProps) => {
  const fullUrl =
    url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle =
    title || (typeof document !== 'undefined' ? document.title : '');
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    if (canShare && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  // If Web Share API is available, use it; otherwise use CopyToClipboard
  if (canShare) {
    return (
      <button type='button' onClick={handleShare} className={cn(className)}>
        {children}
      </button>
    );
  }

  // For fallback, include the message with the URL
  const textToCopy = `${shareMessage} ${fullUrl}`;
  return (
    <CopyToClipboard className={className} textToCopy={textToCopy}>
      {children}
    </CopyToClipboard>
  );
};
