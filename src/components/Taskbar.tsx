import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
  Minimize2,
  XCircle,
  Monitor,
  FolderTree,
  Palette,
} from "lucide-react";
import { useWindowStore } from "../store";
import TaskbarContextMenu from "./TaskbarContextMenu";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
  FolderTree,
  Palette,
};

export default function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow, closeAllWindows, toggleShowDesktop, showDesktop } =
    useWindowStore();

  const openWindows = Object.values(windows);

  if (openWindows.length === 0) return null;

  return (
    <div className="h-12 bg-desktop-taskbar border-t border-desktop-border flex items-center px-3 gap-1.5 shrink-0 z-taskbar">
      {openWindows.map((win) => {
        const Icon = iconMap[win.icon ?? ""] ?? LayoutDashboard;
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all max-w-[180px] ${
                isActive
                  ? "bg-desktop-accent text-white"
                  : "bg-desktop-surface/50 text-desktop-text-muted hover:bg-desktop-surface hover:text-desktop-text"
              } ${win.isMinimized ? "opacity-60" : ""}`}
              title={win.title}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{win.title}</span>
              {win.isMinimized && (
                <Minimize2 className="w-3 h-3 shrink-0 opacity-50" />
              )}
            </button>
          </TaskbarContextMenu>
        );
      })}

      {/* Right-side actions */}
      <div className="mr-auto" />

      {/* Show Desktop toggle */}
      <button
        onClick={toggleShowDesktop}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-desktop-text-muted hover:bg-red-500/20 hover:text-red-400 transition-colors"
        title="بستن همه پنجره‌ها"
      >
        <XCircle className="w-4 h-4" />
        <span>بستن همه</span>
      </button>
    </div>
  );
}
