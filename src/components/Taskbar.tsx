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
} from "lucide-react";
import { useWindowStore } from "../store";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
};

export default function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow } =
    useWindowStore();

  const openWindows = Object.values(windows);

  if (openWindows.length === 0) return null;

  return (
    <div className="h-12 bg-desktop-taskbar border-t border-desktop-border flex items-center px-3 gap-1.5 shrink-0 z-taskbar">
      {openWindows.map((win) => {
        const Icon = iconMap[win.icon ?? ""] ?? LayoutDashboard;
        const isActive = activeWindowId === win.id && !win.isMinimized;

        return (
          <button
            key={win.id}
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
        );
      })}
    </div>
  );
}
