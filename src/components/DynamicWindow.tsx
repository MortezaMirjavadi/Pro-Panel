import { Suspense, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import { Minus, Square, X, Copy, ExternalLink, ArrowRight } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { useWindowStore } from "../store";
import { componentRegistry } from "./registry";
import WindowSkeleton from "./WindowSkeleton";
import WindowErrorFallback from "./WindowErrorFallback";
import { useIsMobile } from "../lib/useIsMobile";
import type { WindowType, WindowSize } from "../store";
import { toast } from "sonner";

interface DynamicWindowProps {
  window: WindowType;
}

/** Threshold in pixels from screen edge to trigger snap */
const SNAP_THRESHOLD = 20;

/** Shared window body content (ErrorBoundary + Suspense + Component) */
function WindowBody({ componentName }: { componentName: string }) {
  const Component = componentRegistry[componentName];
  if (!Component) return null;

  return (
    <ErrorBoundary FallbackComponent={WindowErrorFallback} onReset={() => {}}>
      <Suspense fallback={<WindowSkeleton />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

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

  const isMobile = useIsMobile();
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
    const url = `/popout.html?component=${encodeURIComponent(win.componentName)}`;
    window.open(url, "_blank");
    closeWindow(win.id);
    toast.success(`پنجره "${win.title}" در تب جدید باز شد`);
  }, [win.componentName, win.title, win.id, closeWindow]);

  /** Window snapping logic on drag stop */
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

  // ── Mobile: full-screen modal, no drag/resize ──
  if (isMobile) {
    if (win.isMinimized) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-desktop-bg"
        style={{ zIndex: win.zIndex }}
        onMouseDown={handleMouseDown}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 h-12 shrink-0 bg-desktop-accent">
          <button
            onClick={() => closeWindow(win.id)}
            className="p-2 rounded-md hover:bg-black/10 transition-colors text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-white truncate flex-1 text-center">
            {win.title}
          </span>
          <div className="w-9" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          <WindowBody componentName={win.componentName} />
        </div>
      </div>
    );
  }

  // ── Desktop: draggable/resizable window via react-rnd ──
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
            ? "border-desktop-accent/60 shadow-xl shadow-desktop-accent/20"
            : "border-desktop-border shadow-lg shadow-black/10"
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* ── Window Title Bar (Drag Handle) ── */}
        <div
          className={`window-drag-handle flex items-center justify-between px-4 h-10 shrink-0 select-none ${
            isActive ? "bg-desktop-accent" : "bg-desktop-surface border-b border-desktop-border"
          }`}
          onDoubleClick={handleMaximizeToggle}
        >
          <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-desktop-text-muted"}`}>
            {win.title}
          </span>

          <div className="flex items-center gap-1" dir="ltr">
            <button
              onClick={(e) => { e.stopPropagation(); handlePopOut(); }}
              className={`p-1.5 rounded-md transition-colors ${
                isActive ? "hover:bg-black/10 text-white/90" : "hover:bg-desktop-border/50 text-desktop-text-muted"
              }`}
              title="باز کردن در تب جدید"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
              className={`p-1.5 rounded-md transition-colors ${
                isActive ? "hover:bg-black/10 text-white/90" : "hover:bg-desktop-border/50 text-desktop-text-muted"
              }`}
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleMaximizeToggle(); }}
              className={`p-1.5 rounded-md transition-colors ${
                isActive ? "hover:bg-black/10 text-white/90" : "hover:bg-desktop-border/50 text-desktop-text-muted"
              }`}
              title={win.isMaximized ? "Restore" : "Maximize"}
            >
              {win.isMaximized ? (
                <Copy className="w-3.5 h-3.5" />
              ) : (
                <Square className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
              className={`p-1.5 rounded-md transition-colors ${
                isActive
                  ? "hover:bg-red-500 text-white/90"
                  : "hover:bg-red-500/20 text-red-400"
              }`}
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Window Body ── */}
        <div className="flex-1 overflow-hidden bg-desktop-bg">
          <WindowBody componentName={win.componentName} />
        </div>
      </div>
    </Rnd>
  );
}
