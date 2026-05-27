import { Minimize2, XCircle, Monitor, LayoutDashboard } from "lucide-react";
import { useWindowStore } from "../store";
import { featureRegistry } from "../lib/FeatureRegistry";
import TaskbarContextMenu from "./TaskbarContextMenu";

export default function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow, closeAllWindows, toggleShowDesktop, showDesktop } =
    useWindowStore();

  const openWindows = Object.values(windows);

  if (openWindows.length === 0) return null;

  return (
    <div className="h-13 bg-desktop-taskbar border-t border-desktop-border flex items-center px-3 shrink-0 z-taskbar">
      {/* Scrollable window buttons */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0 py-1.5">
        {openWindows.map((win) => {
          const Icon = featureRegistry.getIcon(win.componentName) ?? LayoutDashboard;
          const isActive = activeWindowId === win.id && !win.isMinimized;

          return (
            <TaskbarContextMenu
              key={win.id}
              windowId={win.id}
              isMinimized={win.isMinimized}
              isActive={isActive}
            >
              <button
                onClick={() => {
                  if (win.isMinimized) {
                    restoreWindow(win.id);
                  } else if (isActive) {
                    minimizeWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
                className={`
                  relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all shrink-0 max-w-[200px] border
                  ${isActive
                    ? "bg-desktop-accent/90 text-white border-desktop-accent shadow-lg shadow-desktop-accent/25"
                    : win.isMinimized
                      ? "bg-desktop-surface/60 text-desktop-text-muted border-desktop-border/60 hover:bg-desktop-surface hover:text-desktop-text opacity-70"
                      : "bg-desktop-surface text-desktop-text border-desktop-border hover:border-desktop-accent/40 hover:bg-desktop-surface/80"
                  }
                `}
                title={win.title}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/80 rounded-full" />
                )}
                {/* Minimized indicator dot */}
                {win.isMinimized && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-desktop-text-muted/50 rounded-full" />
                )}

                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{win.title}</span>
                {win.isMinimized && (
                  <Minimize2 className="w-3 h-3 shrink-0 opacity-50 ml-0.5" />
                )}
              </button>
            </TaskbarContextMenu>
          );
        })}
      </div>

      {/* Fixed action buttons */}
      <div className="flex items-center gap-1.5 shrink-0 mr-2">
        {/* Show Desktop toggle */}
        <button
          onClick={toggleShowDesktop}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            showDesktop
              ? "bg-desktop-accent text-white"
              : "text-desktop-text-muted hover:bg-desktop-surface hover:text-desktop-text"
          }`}
          title="نمایش دسکتاپ (Alt+D)"
        >
          <Monitor className="w-4 h-4" />
          <span>دسکتاپ</span>
        </button>

        {/* Close all windows */}
        <button
          onClick={closeAllWindows}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-desktop-text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
          title="بستن همه پنجره‌ها"
        >
          <XCircle className="w-4 h-4" />
          <span>بستن همه</span>
        </button>
      </div>
    </div>
  );
}
