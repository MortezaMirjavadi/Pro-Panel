import { lazy } from "react";
import type { LucideIcon } from "lucide-react";
import {
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
  Table,
} from "lucide-react";

/**
 * Canonical definition of a pluggable application in the desktop shell.
 *
 * Teams register `AppDefinition` objects to add new "apps" (windows) to the
 * desktop without modifying the core OS code (Sidebar, Taskbar, Command Palette).
 */
export interface AppDefinition {
  /** Unique slug used as the window ID prefix and registry key */
  id: string;
  /** Display title (shown in title bar, taskbar, menus) */
  title: string;
  /** Lucide icon component rendered in Sidebar, Taskbar, Command Palette */
  icon: LucideIcon;
  /** Lazy-loaded React component rendered inside the window body */
  component: React.LazyExoticComponent<React.ComponentType>;
  /** RBAC roles allowed to see/use this app. Empty/undefined = public. */
  requiredPermissions?: string[];
}

/**
 * Centralized, immutable registry of all desktop applications.
 *
 * The shell (Sidebar, Taskbar, Command Palette, DynamicWindow) reads from this
 * single source of truth. External plugins can call `register()` at import time
 * to add new apps.
 */
class FeatureRegistry {
  private apps = new Map<string, AppDefinition>();

  /** Register a new application. Overwrites if the ID already exists. */
  register(app: AppDefinition): void {
    this.apps.set(app.id, app);
  }

  /** Register multiple applications at once. */
  registerAll(apps: AppDefinition[]): void {
    for (const app of apps) {
      this.apps.set(app.id, app);
    }
  }

  /** Get a single app definition by its ID. */
  get(id: string): AppDefinition | undefined {
    return this.apps.get(id);
  }

  /** Get all registered applications (insertion order). */
  getAll(): AppDefinition[] {
    return Array.from(this.apps.values());
  }

  /** Get only the apps the given role is allowed to access. */
  getByAccess(hasAccess: (roles?: string[]) => boolean): AppDefinition[] {
    return this.getAll().filter((app) => hasAccess(app.requiredPermissions));
  }

  /** Resolve the lazy component for a given app ID. */
  getComponent(appId: string): React.LazyExoticComponent<React.ComponentType> | undefined {
    return this.apps.get(appId)?.component;
  }

  /** Resolve the Lucide icon component for a given app ID. */
  getIcon(appId: string): LucideIcon | undefined {
    return this.apps.get(appId)?.icon;
  }

  /**
   * Build a `Record<string, LucideIcon>` keyed by app ID.
   * Useful for components that render icons in lists (Sidebar, Taskbar).
   */
  getIconMap(): Record<string, LucideIcon> {
    const map: Record<string, LucideIcon> = {};
    for (const [id, app] of this.apps) {
      map[id] = app.icon;
    }
    return map;
  }
}

// ── Singleton instance ────────────────────────────────────────────────
export const featureRegistry = new FeatureRegistry();

// ── Built-in application registrations ────────────────────────────────

featureRegistry.registerAll([
  {
    id: "dashboard",
    title: "داشبورد",
    icon: LayoutDashboard,
    component: lazy(() => import("../windows/Dashboard")),
  },
  {
    id: "users",
    title: "کاربران",
    icon: Users,
    component: lazy(() => import("../windows/Users")),
  },
  {
    id: "settings",
    title: "تنظیمات",
    icon: Settings,
    component: lazy(() => import("../windows/Settings")),
  },
  {
    id: "analytics",
    title: "تحلیل‌ها",
    icon: BarChart3,
    component: lazy(() => import("../windows/Analytics")),
  },
  {
    id: "file-manager",
    title: "مدیریت فایل",
    icon: FolderOpen,
    component: lazy(() => import("../windows/FileManager")),
  },
  {
    id: "messages",
    title: "پیام‌ها",
    icon: MessageSquare,
    component: lazy(() => import("../windows/Messages")),
  },
  {
    id: "calendar",
    title: "تقویم",
    icon: Calendar,
    component: lazy(() => import("../windows/Calendar")),
  },
  {
    id: "terminal",
    title: "ترمینال",
    icon: Terminal,
    component: lazy(() => import("../windows/Terminal")),
    requiredPermissions: ["ADMIN"],
  },
  {
    id: "app-explorer",
    title: "کاوشگر برنامه‌ها",
    icon: FolderTree,
    component: lazy(() => import("../explorer/AppExplorer")),
  },
  {
    id: "theme-picker",
    title: "انتخاب تم",
    icon: Palette,
    component: lazy(() => import("../components/ThemePicker")),
  },
  {
    id: "data-grid",
    title: "جدول داده‌ها",
    icon: Table,
    component: lazy(() => import("../windows/DataGrid")),
  },
]);
