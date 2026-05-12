import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from 'react';

export interface UseDragToDismissOptions {
  /** When false, drag state resets and the sheet does not translate. */
  enabled: boolean;
  onDismiss: () => void;
  /** Vertical drag past this value (px) calls `onDismiss`. Default 100. */
  threshold?: number;
  /** CSS `transition` when not actively dragging. */
  transitionIdle?: string;
}

export interface UseDragToDismissReturn {
  dragRegionRef: RefObject<HTMLDivElement | null>;
  sheetStyle: CSSProperties | undefined;
  sheetClassName: string | undefined;
  onHandlePointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerUp: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
}

/**
 * Pointer-driven vertical drag with translateY on a sheet and dismiss past a threshold.
 * Pair the returned ref + pointer handlers on a drag handle (e.g. bottom-sheet pill).
 */
export function useDragToDismiss({
  enabled,
  onDismiss,
  threshold = 100,
  transitionIdle = 'transform 0.22s ease-out',
}: UseDragToDismissOptions): UseDragToDismissReturn {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRegionRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const dragYRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      draggingRef.current = false;
      dragYRef.current = 0;
      setDragY(0);
      setIsDragging(false);
    }
  }, [enabled]);

  const onHandlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      const region = dragRegionRef.current;
      if (region?.hasPointerCapture(e.pointerId)) {
        region.releasePointerCapture(e.pointerId);
      }
      const shouldClose = dragYRef.current > threshold;
      dragYRef.current = 0;
      setDragY(0);
      if (shouldClose) {
        onDismiss();
      }
    },
    [onDismiss, threshold],
  );

  const onHandlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      draggingRef.current = true;
      startYRef.current = e.clientY;
      dragYRef.current = 0;
      setDragY(0);
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [enabled],
  );

  const onHandlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const y = Math.max(0, e.clientY - startYRef.current);
    dragYRef.current = y;
    setDragY(y);
  }, []);

  const sheetStyle: CSSProperties | undefined = enabled
    ? {
        transform: `translateY(${dragY}px)`,
        transition: isDragging ? 'none' : transitionIdle,
      }
    : undefined;

  const sheetClassName = enabled ? 'will-change-transform' : undefined;

  return {
    dragRegionRef,
    sheetStyle,
    sheetClassName,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel: onHandlePointerUp,
  };
}
