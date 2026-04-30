import { useCallback, useState } from "react";

function getLocationPathForClipboard(): string {
  if (typeof window === "undefined") return "";
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

export function useCopyPagePath() {
  const [copied, setCopied] = useState(false);

  const copyPath = useCallback(async () => {
    const text = getLocationPathForClipboard();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard denied */
    }
  }, []);

  return { copyPath, copied };
}
