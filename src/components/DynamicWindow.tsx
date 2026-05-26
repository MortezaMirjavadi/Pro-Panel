import { Suspense, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { Minus, Square, X, Copy, ExternalLink } from "lucide-react";
import { useWindowStore } from "../store";
import { componentRegistry } from "./registry";
import WindowSkeleton from "./WindowSkeleton";
import type { WindowType, WindowSize } from "../store";
import { toast } from "sonner";

interface DynamicWindowProps {
  window: WindowType;
}

/** Threshold in pixels from screen edge to trigger snap */
const SNAP_THRESHOLD = 20;

export default function DynamicWindow({ window: win }: DynamicWindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    updateWindowSnap,
    activeWindowId,
  } = useWindowStore();

  const isActive = activeWindowId === win.id;
  const Component = componentRegistry[win.componentName];

  /** Track pre-snap size during a drag operation */
  const preSnapSizeRef = useRef<WindowSize | null>(win.preSnapSize ?? null);

  /** Bring this window to the front on any click */
  const handleMouseDown = useCallback(() => {
    focusWindow(win.id);
  }, [win.id, focusWindow]);

  /** Toggle between maximized and restored states */
  const handleMaximizeToggle = useCallback(() => {
    if (win.isMaximized) {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  }, [win.id, win.isMaximized, maximizeWindow, restoreWindow]);

  /** Pop out window into a new browser tab */
  const handlePopOut = useCallback(() => {
    const url = `/popout/${win.componentName}`;
    window.open(url, "_blank");
    closeWindow(win.id);
    toast.success(`پنجره "${win.title}" در تب جدید باز شد`);
  }, [win.componentName, win.title, win.id, closeWindow]);

  /**
   * Window snapping logic on drag stop.
   * - Drag to left edge (x <= SNAP_THRESHOLD) → snap left 50%
   * - Drag to right edge (x >= parentWidth - windowWidth - SNAP_THRESHOLD) → snap right 50%
   * - Otherwise → normal position update, restore pre-snap size if it was snapped
   */
  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      const parent = document.querySelector("main");
      if (!parent) {
        updateWindowPosition(win.id, { x: d.x, y: d.y });
        return;
      }

      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;
      const currentWidth = win.isMaximized ? parentWidth : win.size.width;
      const halfWidth = Math.floor(parentWidth / 2);

      // Left edge snap
      if (d.x <= SNAP_THRESHOLD) {
        // Save current size before snapping (only if not already snapped)
        if (preSnapSizeRef.current === null) {
          preSnapSizeRef.current = { width: currentWidth, height: win.size.height };
        }
        updateWindowSnap(win.id, { width: halfWidth, height: parentHeight }, preSnapSizeRef.current);
        toast.info("پنجره به لبه چپ چسبید");
        return;
      }

      // Right edge snap
      if (d.x >= parentWidth - currentWidth - SNAP_THRESHOLD) {
        if (preSnapSizeRef.current === null) {
          preSnapSizeRef.current = { width: currentWidth, height: win.size.height };
        }
        // Position at the right half
        updateWindowPosition(win.id, { x: halfWidth, y: 0 });
        updateWindowSize(win.id, { width: halfWidth, height: parentHeight });
        toast.info("پنجره به لبه راست چسبید");
        return;
      }

      // Normal drag — restore pre-snap size if window was previously snapped
      if (preSnapSizeRef.current) {
        const restored = preSnapSizeRef.current;
        preSnapSizeRef.current = null;
        updateWindowPosition(win.id, { x: d.x, y: d.y });
        updateWindowSize(win.id, restored);
        // Clear snap state in store
        updateWindowSnap(win.id, restored, null);
        return;
      }

      updateWindowPosition(win.id, { x: d.x, y: d.y });
    },
    [win.id, win.size, win.isMaximized, updateWindowPosition, updateWindowSize, updateWindowSnap]
  );

  if (!Component) {
    return null;
  }

  return (
    <Rnd
      size={{
        width: win.isMaximized ? "100%" : win.size.width,
        height: win.isMaximized ? "100%" : win.size.height,
      }}
      position={{
        x: win.isMaximized ? 0 : win.position.x,
        y: win.isMaximized ? 0 : win.position.y,
      }}
      minWidth={400}
      minHeight={300}
      dragHandleClassName="window-drag-handle"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
      onMouseDown={handleMouseDown}
      onDragStop={handleDragStop}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        // Clear snap state when user manually resizes
        preSnapSizeRef.current = null;
        updateWindowSize(win.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        updateWindowPosition(win.id, position);
      }}
      bounds="parent"
      style={{
        zIndex: win.zIndex,
        display: win.isMinimized ? "none" : "block",
      }}
      className="absolute"
    >
      <div
        className={`flex flex-col h-full rounded-xl overflow-hidden border transition-shadow duration-200 ${
          isActive
            ? "border-desktop-accent/60 shadow-lg shadow-desktop-accent/10"
            : "border-desktop-border shadow-lg shadow-black/20"
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* ── Window Title Bar (Drag Handle) ── */}
        <div
          className={`window-drag-handle flex items-center justify-between px-4 h-10 shrink-0 select-none ${
            isActive ? "bg-desktop-accent/90" : "bg-desktop-surface"
          }`}
          onDoubleClick={handleMaximizeToggle}
        >
          {/* Title */}
          <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-desktop-text-muted"}`}>
            {win.title}
          </span>

          {/* Window Controls */}
          <div className="flex items-center gap-1" dir="ltr">
            {/* Pop-out button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePopOut();
              }}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              title="باز کردن در تب جدید"
            >
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(win.id);
              }}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5 text-white/80" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMaximizeToggle();
              }}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              title={win.isMaximized ? "Restore" : "Maximize"}
            >
              {win.isMaximized ? (
                <Copy className="w-3.5 h-3.5 text-white/80" />
              ) : (
                <Square className="w-3.5 h-3.5 text-white/80" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(win.id);
              }}
              className="p-1.5 rounded-md hover:bg-red-500 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>

        {/* ── Window Body ── */}
        <div className="flex-1 overflow-hidden bg-desktop-bg">
          <Suspense fallback={<WindowSkeleton />}>
            <Component />
          </Suspense>
        </div>
      </div>
    </Rnd>
  );
}
