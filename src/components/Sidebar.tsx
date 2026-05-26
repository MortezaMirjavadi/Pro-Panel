import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Search,
  FolderTree,
} from "lucide-react";
import { useWindowStore } from "../store";
import { windowDefinitions } from "./registry";

/** Map icon string names to Lucide components */
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { openWindow, setPaletteOpen } = useWindowStore();

  return (
    <aside
      className={`bg-desktop-sidebar border-l border-desktop-border flex flex-col transition-all duration-300 shrink-0 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo / Brand */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-desktop-border">
        {!collapsed && (
          <span className="text-lg font-bold text-desktop-accent">پرو پنل</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-desktop-border/50 transition-colors"
        >
          {collapsed ? (
            <ChevronLeft className="w-4 h-4 text-desktop-text-muted" />
          ) : (
            <ChevronRight className="w-4 h-4 text-desktop-text-muted" />
          )}
        </button>
      </div>

      {/* Search trigger */}
      <div className="p-3">
        <button
          onClick={() => setPaletteOpen(true)}
          className={`flex items-center gap-2 w-full rounded-lg border border-desktop-border hover:border-desktop-accent/50 transition-colors ${
            collapsed ? "justify-center p-2" : "px-3 py-2"
          }`}
        >
          <Search className="w-4 h-4 text-desktop-text-muted" />
          {!collapsed && (
            <span className="text-sm text-desktop-text-muted">جستجو... ⌘K</span>
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {windowDefinitions.map((def) => {
          const Icon = iconMap[def.icon] ?? LayoutDashboard;
          return (
            <button
              key={def.id}
              onClick={() =>
                openWindow({
                  id: def.id,
                  title: def.title,
                  componentName: def.componentName,
                  icon: def.icon,
                })
              }
              className={`flex items-center gap-3 w-full rounded-lg transition-colors hover:bg-desktop-border/50 ${
                collapsed ? "justify-center p-3" : "px-3 py-2.5"
              }`}
              title={def.title}
            >
              <Icon className="w-5 h-5 text-desktop-text-muted shrink-0" />
              {!collapsed && (
                <span className="text-sm text-desktop-text truncate">{def.title}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-desktop-border">
          <p className="text-xs text-desktop-text-muted text-center">نسخه ۱.۰.۰</p>
        </div>
      )}
    </aside>
  );
}
