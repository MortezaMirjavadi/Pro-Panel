import { useEffect, useCallback } from "react";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
  X,
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

export default function CommandPalette() {
  const { isPaletteOpen, setPaletteOpen, windows, focusWindow, restoreWindow } =
    useWindowStore();

  const openWindows = Object.values(windows);

  /** Global keyboard shortcut: Cmd+K / Ctrl+K */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(!isPaletteOpen);
      }
      if (e.key === "Escape" && isPaletteOpen) {
        setPaletteOpen(false);
      }
    },
    [isPaletteOpen, setPaletteOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /** Select a window from the palette */
  const handleSelect = (windowId: string) => {
    const win = windows[windowId];
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(windowId);
    }
    focusWindow(windowId);
    setPaletteOpen(false);
  };

  if (!isPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-palette flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setPaletteOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[560px] mx-4">
        <Command>
          <div className="relative">
            <Command.Input placeholder="جستجوی پنجره‌های باز..." autoFocus />
            <button
              onClick={() => setPaletteOpen(false)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-desktop-border/50"
            >
              <X className="w-4 h-4 text-desktop-text-muted" />
            </button>
          </div>
          <Command.List>
            <Command.Empty>پنجره‌ای یافت نشد.</Command.Empty>
            <Command.Group heading="پنجره‌های باز">
              {openWindows.map((win) => {
                const Icon = iconMap[win.icon ?? ""] ?? LayoutDashboard;
                return (
                  <Command.Item
                    key={win.id}
                    value={`${win.title} ${win.componentName}`}
                    onSelect={() => handleSelect(win.id)}
                  >
                    <Icon className="w-4 h-4 text-desktop-accent" />
                    <span className="flex-1">{win.title}</span>
                    {win.isMinimized && (
                      <span className="text-xs text-desktop-text-muted bg-desktop-border/50 px-2 py-0.5 rounded">
                        حداقل شده
                      </span>
                    )}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
