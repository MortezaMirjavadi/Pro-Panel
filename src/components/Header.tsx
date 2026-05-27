import { useState, useEffect } from "react";
import { Search, Clock, User, ChevronDown } from "lucide-react";
import { useWindowStore } from "../store";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const { setPaletteOpen, windows } = useWindowStore();
  const user = useAuthStore((s) => s.user);
  const switchRole = useAuthStore((s) => s.switchRole);
  const [time, setTime] = useState(() => new Date());
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const openCount = Object.keys(windows).length;

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("fa-IR", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const roleLabels: Record<string, string> = {
    ADMIN: "مدیر",
    EDITOR: "ویرایشگر",
    VIEWER: "بیننده",
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-500/20 text-red-400",
    EDITOR: "bg-blue-500/20 text-blue-400",
    VIEWER: "bg-green-500/20 text-green-400",
  };

  return (
    <header className="h-10 bg-desktop-surface border-b border-desktop-border flex items-center px-4 shrink-0 z-sidebar select-none">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-desktop-accent">پرو پنل</span>
        <span className="text-[10px] text-desktop-text-muted bg-desktop-border/50 px-1.5 py-0.5 rounded">
          v1.0
        </span>
      </div>

      {/* Center: Search + Open count */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg border border-desktop-border hover:border-desktop-accent/50 transition-colors text-sm text-desktop-text-muted"
        >
          <Search className="w-3.5 h-3.5" />
          <span>جستجو...</span>
          <kbd className="text-[10px] bg-desktop-border/50 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        {openCount > 0 && (
          <span className="text-xs text-desktop-text-muted">
            {openCount} پنجره باز
          </span>
        )}
      </div>

      {/* Right side: Time, Role, User */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="flex items-center gap-1.5 text-desktop-text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs tabular-nums">{formattedTime}</span>
          <span className="text-xs opacity-60">{formattedDate}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-desktop-border" />

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors ${
              roleColors[user?.role ?? "ADMIN"] ?? ""
            }`}
          >
            <span>{roleLabels[user?.role ?? "ADMIN"] ?? user?.role}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 bg-desktop-surface border border-desktop-border rounded-lg shadow-xl py-1 min-w-[120px] z-50">
                {(["ADMIN", "EDITOR", "VIEWER"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 text-xs transition-colors ${
                      user?.role === role
                        ? "bg-desktop-accent/20 text-desktop-accent"
                        : "text-desktop-text hover:bg-desktop-border/50"
                    }`}
                  >
                    {roleLabels[role]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-desktop-accent/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-desktop-accent" />
          </div>
          <span className="text-xs text-desktop-text-muted">{user?.name ?? "کاربر"}</span>
        </div>
      </div>
    </header>
  );
}
