import {
  createContext,
  useContext,
  useMemo,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { cn } from '~/lib/utils';

import {
  useDragToDismiss,
  type UseDragToDismissOptions,
} from './use-drag-to-dismiss';

interface DraggableMobileSheetContextValue {
  enabled: boolean;
  dragRegionRef: RefObject<HTMLDivElement | null>;
  onHandlePointerDown: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerMove: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerUp: (e: PointerEvent<HTMLDivElement>) => void;
  onHandlePointerCancel: (e: PointerEvent<HTMLDivElement>) => void;
}

const DraggableMobileSheetContext =
  createContext<DraggableMobileSheetContextValue | null>(null);

export interface DraggableMobileSheetProps extends UseDragToDismissOptions {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Wraps a bottom sheet (or similar) and applies `translateY` while dragging when `enabled`.
 * Place {@link DraggableMobileSheetHandle} (or your own element using {@link useDragToDismiss}) for the grip region.
 */
export function DraggableMobileSheet({
  enabled,
  onDismiss,
  threshold,
  transitionIdle,
  className,
  style,
  children,
}: DraggableMobileSheetProps) {
  const drag = useDragToDismiss({
    enabled,
    onDismiss,
    threshold,
    transitionIdle,
  });

  const contextValue = useMemo<DraggableMobileSheetContextValue>(
    () => ({
      enabled,
      dragRegionRef: drag.dragRegionRef,
      onHandlePointerDown: drag.onHandlePointerDown,
      onHandlePointerMove: drag.onHandlePointerMove,
      onHandlePointerUp: drag.onHandlePointerUp,
      onHandlePointerCancel: drag.onHandlePointerCancel,
    }),
    [
      enabled,
      drag.dragRegionRef,
      drag.onHandlePointerDown,
      drag.onHandlePointerMove,
      drag.onHandlePointerUp,
      drag.onHandlePointerCancel,
    ],
  );

  return (
    <DraggableMobileSheetContext.Provider value={contextValue}>
      <div
        className={cn(className, drag.sheetClassName)}
        style={{ ...style, ...drag.sheetStyle }}
      >
        {children}
      </div>
    </DraggableMobileSheetContext.Provider>
  );
}

export interface DraggableMobileSheetHandleProps {
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}

/** Drag handle row; must be rendered inside {@link DraggableMobileSheet}. */
export function DraggableMobileSheetHandle({
  className,
  children,
  'aria-label': ariaLabel,
}: DraggableMobileSheetHandleProps) {
  const ctx = useContext(DraggableMobileSheetContext);
  if (!ctx) {
    throw new Error(
      'DraggableMobileSheetHandle must be used inside DraggableMobileSheet',
    );
  }

  const {
    enabled,
    dragRegionRef,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
  } = ctx;

  return (
    <div
      ref={dragRegionRef}
      className={className}
      aria-hidden={!enabled}
      aria-label={enabled ? ariaLabel : undefined}
      onPointerDown={onHandlePointerDown}
      onPointerMove={onHandlePointerMove}
      onPointerUp={onHandlePointerUp}
      onPointerCancel={onHandlePointerCancel}
    >
      {children}
    </div>
  );
}
