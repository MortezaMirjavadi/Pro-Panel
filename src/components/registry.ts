import { lazy } from "react";

/**
 * Registry mapping componentName strings to lazy-loaded React components.
 * Each entry corresponds to a "desktop application" window.
 */
export const componentRegistry: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  Dashboard: lazy(() => import("../windows/Dashboard")),
  Users: lazy(() => import("../windows/Users")),
  Settings: lazy(() => import("../windows/Settings")),
  Analytics: lazy(() => import("../windows/Analytics")),
  FileManager: lazy(() => import("../windows/FileManager")),
  Messages: lazy(() => import("../windows/Messages")),
  Calendar: lazy(() => import("../windows/Calendar")),
  Terminal: lazy(() => import("../windows/Terminal")),
  AppExplorer: lazy(() => import("../explorer/AppExplorer")),
  ThemePicker: lazy(() => import("../components/ThemePicker")),
};

/** All available window definitions for menus and command palette */
export const windowDefinitions = [
  { id: "dashboard", title: "داشبورد", componentName: "Dashboard", icon: "LayoutDashboard" },
  { id: "users", title: "کاربران", componentName: "Users", icon: "Users" },
  { id: "settings", title: "تنظیمات", componentName: "Settings", icon: "Settings" },
  { id: "analytics", title: "تحلیل‌ها", componentName: "Analytics", icon: "BarChart3" },
  { id: "file-manager", title: "مدیریت فایل", componentName: "FileManager", icon: "FolderOpen" },
  { id: "messages", title: "پیام‌ها", componentName: "Messages", icon: "MessageSquare" },
  { id: "calendar", title: "تقویم", componentName: "Calendar", icon: "Calendar" },
  { id: "terminal", title: "ترمینال", componentName: "Terminal", icon: "Terminal", allowedRoles: ["ADMIN"] },
  { id: "app-explorer", title: "کاوشگر برنامه‌ها", componentName: "AppExplorer", icon: "FolderTree" },
  { id: "theme-picker", title: "انتخاب تم", componentName: "ThemePicker", icon: "Palette" },
] as const;

/** Type for a window definition including optional RBAC */
export type WindowDefinition = (typeof windowDefinitions)[number];
