import { Suspense, useCallback } from "react";
import { Rnd } from "react-rnd";
import { Minus, Square, X, Copy } from "lucide-react";
import { useWindowStore } from "../store";
import { componentRegistry } from "./registry";
import type { WindowType } from "../store";

interface DynamicWindowProps {
  window: WindowType;
}

/** Loading fallback for lazy-loaded window content */
function WindowLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-desktop-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-desktop-text-muted">در حال بارگذاری...</span>
      </div>
    </div>
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
    activeWindowId,
  } = useWindowStore();

  const isActive = activeWindowId === win.id;
  const Component = componentRegistry[win.componentName];

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
      onDragStop={(_e, d) => {
        updateWindowPosition(win.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
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
          <Suspense fallback={<WindowLoader />}>
            <Component />
          </Suspense>
        </div>
      </div>
    </Rnd>
  );
}
