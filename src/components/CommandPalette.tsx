import { useMemo } from "react";
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
  AppWindow,
  Grid3x3,
  FolderTree,
} from "lucide-react";
import { useWindowStore } from "../store";
import { useAuthStore } from "../store/authStore";
import { windowDefinitions } from "./registry";

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
};

export default function CommandPalette() {
  const { isPaletteOpen, setPaletteOpen, windows, focusWindow, restoreWindow, openWindow } =
    useWindowStore();
  const hasAccess = useAuthStore((s) => s.hasAccess);

  const openWindows = Object.values(windows);

  /** Filter available apps by the current user's role */
  const accessibleApps = useMemo(
    () => windowDefinitions.filter((def) => hasAccess((def as Record<string, unknown>).allowedRoles as string[] | undefined)),
    [hasAccess]
  );

  /** Select an already-open window from the palette */
  const handleSelectWindow = (windowId: string) => {
    const win = windows[windowId];
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(windowId);
    }
    focusWindow(windowId);
    setPaletteOpen(false);
  };

  /** Open a new window from the "Available Apps" group */
  const handleOpenApp = (componentName: string) => {
    const def = windowDefinitions.find((d) => d.componentName === componentName);
    if (!def) return;

    openWindow({
      id: def.id,
      title: def.title,
      componentName: def.componentName,
      icon: def.icon,
    });
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
            <Command.Input placeholder="جستجوی پنجره یا برنامه..." autoFocus />
            <button
              onClick={() => setPaletteOpen(false)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-desktop-border/50"
            >
              <X className="w-4 h-4 text-desktop-text-muted" />
            </button>
          </div>
          <Command.List>
            <Command.Empty>نتیجه‌ای یافت نشد.</Command.Empty>

            {/* ── Group 1: Open Windows ── */}
            {openWindows.length > 0 && (
              <Command.Group heading="پنجره‌های باز">
                {openWindows.map((win) => {
                  const Icon = iconMap[win.icon ?? ""] ?? LayoutDashboard;
                  return (
                    <Command.Item
                      key={`open-${win.id}`}
                      value={`open ${win.title} ${win.componentName}`}
                      onSelect={() => handleSelectWindow(win.id)}
                    >
                      <AppWindow className="w-4 h-4 text-desktop-accent" />
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
            )}

            <Command.Separator />

            {/* ── Group 2: Available Apps (filtered by role) ── */}
            <Command.Group heading="برنامه‌های موجود">
              {accessibleApps.map((def) => {
                const Icon = iconMap[def.icon] ?? LayoutDashboard;
                const isOpen = !!windows[def.id];
                return (
                  <Command.Item
                    key={`app-${def.id}`}
                    value={`app ${def.title} ${def.componentName}`}
                    onSelect={() => handleOpenApp(def.componentName)}
                  >
                    <Grid3x3 className="w-4 h-4 text-desktop-text-muted" />
                    <Icon className="w-4 h-4 text-desktop-accent" />
                    <span className="flex-1">{def.title}</span>
                    {isOpen && (
                      <span className="text-xs text-green-400 bg-green-500/15 px-2 py-0.5 rounded">
                        باز
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
