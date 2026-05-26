import { useWindowStore } from "./store";
import Sidebar from "./components/Sidebar";
import Taskbar from "./components/Taskbar";
import DynamicWindow from "./components/DynamicWindow";
import CommandPalette from "./components/CommandPalette";
import GlobalShortcuts from "./components/GlobalShortcuts";
import DesktopContextMenu from "./components/DesktopContextMenu";
import { useIsMobile } from "./lib/useIsMobile";
import { Toaster } from "sonner";

export default function App() {
  const { windows, theme, wallpaper } = useWindowStore();
  const allWindows = Object.values(windows);
  const isMobile = useIsMobile();

  return (
    <div
      dir="rtl"
      className={`h-screen w-screen flex flex-col overflow-hidden select-none ${
        theme === "dark" ? "bg-desktop-bg text-desktop-text" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ── Main Content Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — hidden on mobile */}
        {!isMobile && <Sidebar />}

        {/* Desktop Area — windows render here */}
        <DesktopContextMenu>
          <main className="flex-1 relative overflow-hidden">
          {/* Background: wallpaper or default grid (hidden on mobile when windows are open) */}
          {!isMobile && (
            wallpaper ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${wallpaper})` }}
              />
            ) : (
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #6c5ce7 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            )
          )}

          {/* Windows */}
          {allWindows.map((win) => (
            <DynamicWindow key={win.id} window={win} />
          ))}

          {/* Empty state — desktop only */}
          {allWindows.length === 0 && !isMobile && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4 opacity-20">💻</p>
                <p className="text-desktop-text-muted text-lg">
                  از منوی کناری یک برنامه انتخاب کنید
                </p>
                <p className="text-desktop-text-muted/60 text-sm mt-2">
                  ⌘K برای جستجوی سریع
                </p>
              </div>
            </div>
          )}

          {/* Mobile: show app list when no windows open */}
          {allWindows.length === 0 && isMobile && <MobileAppList />}
          </main>
        </DesktopContextMenu>
      </div>

      {/* ── Taskbar — hidden on mobile ── */}
      {!isMobile && <Taskbar />}

      {/* ── Command Palette (overlay) ── */}
      <CommandPalette />

      {/* ── Global Keyboard Shortcuts (invisible) ── */}
      <GlobalShortcuts />

      {/* ── Toast Notifications ── */}
      <Toaster
        position={isMobile ? "top-center" : "bottom-left"}
        dir="rtl"
        toastOptions={{
          style: {
            background: theme === "dark" ? "#252641" : "#fff",
            color: theme === "dark" ? "#e4e6f0" : "#1a1a1a",
            border: `1px solid ${theme === "dark" ? "#363858" : "#e5e7eb"}`,
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}

/** Mobile-friendly app launcher shown when no windows are open */
function MobileAppList() {
  const { openWindow } = useWindowStore();

  const apps = [
    { id: "dashboard", title: "داشبورد", componentName: "Dashboard" },
    { id: "users", title: "کاربران", componentName: "Users" },
    { id: "analytics", title: "تحلیل‌ها", componentName: "Analytics" },
    { id: "messages", title: "پیام‌ها", componentName: "Messages" },
    { id: "calendar", title: "تقویم", componentName: "Calendar" },
    { id: "file-manager", title: "مدیریت فایل", componentName: "FileManager" },
    { id: "settings", title: "تنظیمات", componentName: "Settings" },
    { id: "app-explorer", title: "کاوشگر", componentName: "AppExplorer" },
  ];

  return (
    <div className="absolute inset-0 overflow-auto p-4" dir="rtl">
      <h2 className="text-lg font-bold mb-4 text-center">برنامه‌ها</h2>
      <div className="grid grid-cols-3 gap-3">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() =>
              openWindow({
                id: app.id,
                title: app.title,
                componentName: app.componentName,
              })
            }
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-desktop-surface border border-desktop-border hover:border-desktop-accent/50 transition-colors"
          >
            <span className="text-sm font-medium">{app.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
