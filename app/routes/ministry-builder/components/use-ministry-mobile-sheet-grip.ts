import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent,
  type SetStateAction,
} from 'react';

import { cn } from '~/lib/utils';

const DISMISS_DRAG_PX = 100;
const OPEN_DRAG_PX = 56;

/** Same breakpoint as Tailwind `md` — use for `matchMedia` where you drive `mobileNarrow`. */
export const MINISTRY_SHEET_MOBILE_MQ = '(max-width: 767px)';

export interface UseMinistryMobileSheetGripOptions {
  mobileNarrow: boolean;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

/**
 * One grip row on mobile: drag down while open (with sheet follow) to dismiss;
 * drag up while closed past a threshold to open. No-op on desktop (`!mobileNarrow`).
 */
export function useMinistryMobileSheetGrip({
  mobileNarrow,
  isExpanded,
  setIsExpanded,
}: UseMinistryMobileSheetGripOptions) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const dragYRef = useRef(0);

  useEffect(() => {
    draggingRef.current = false;
    dragYRef.current = 0;
    setDragY(0);
    setIsDragging(false);
  }, [mobileNarrow, isExpanded]);

  const finish = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !mobileNarrow) return;
      draggingRef.current = false;
      setIsDragging(false);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (isExpanded) {
        const shouldClose = dragYRef.current > DISMISS_DRAG_PX;
        dragYRef.current = 0;
        setDragY(0);
        if (shouldClose) setIsExpanded(false);
      } else {
        const deltaUp = startYRef.current - e.clientY;
        if (deltaUp > OPEN_DRAG_PX) setIsExpanded(true);
      }
    },
    [mobileNarrow, isExpanded, setIsExpanded],
  );

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!mobileNarrow) return;
      draggingRef.current = true;
      startYRef.current = e.clientY;
      dragYRef.current = 0;
      setDragY(0);
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [mobileNarrow],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !mobileNarrow || !isExpanded) return;
      const y = Math.max(0, e.clientY - startYRef.current);
      dragYRef.current = y;
      setDragY(y);
    },
    [mobileNarrow, isExpanded],
  );

  const sheetStyle: CSSProperties | undefined =
    mobileNarrow && isExpanded
      ? {
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.22s ease-out',
        }
      : undefined;

  const sheetClassName =
    mobileNarrow && isExpanded ? 'will-change-transform' : undefined;

  const gripRowProps = {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel: finish,
    'aria-label': isExpanded
      ? 'Drag down to close service times'
      : 'Drag up to open service times',
  } as const;

  const gripRowClassName = cn(
    'flex items-center justify-center py-2.5 md:hidden',
    mobileNarrow &&
      'touch-none cursor-grab select-none active:cursor-grabbing',
    !mobileNarrow && 'pointer-events-none',
  );

  return { sheetStyle, sheetClassName, gripRowProps, gripRowClassName };
}
