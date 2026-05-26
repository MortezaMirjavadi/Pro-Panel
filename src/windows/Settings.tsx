import { useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Shield, Palette } from "lucide-react";

const sections = [
  { id: "general", label: "عمومی", icon: SettingsIcon },
  { id: "appearance", label: "ظاهر", icon: Palette },
  { id: "notifications", label: "اعلان‌ها", icon: Bell },
  { id: "security", label: "امنیت", icon: Shield },
  { id: "language", label: "زبان", icon: Globe },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [rtl, setRtl] = useState(true);

  return (
    <div className="flex h-full" dir="rtl">
      {/* Settings sidebar */}
      <div className="w-48 border-l border-desktop-border bg-desktop-surface/50 p-3 space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-right ${
              activeSection === section.id
                ? "bg-desktop-accent text-white"
                : "hover:bg-desktop-border/50 text-desktop-text-muted"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-6">تنظیمات</h2>

        <div className="space-y-6 max-w-lg">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between bg-desktop-surface border border-desktop-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-desktop-accent" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <div>
                <p className="font-medium">حالت تاریک</p>
                <p className="text-sm text-desktop-text-muted">فعال‌سازی تم تاریک برنامه</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                darkMode ? "bg-desktop-accent" : "bg-desktop-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  darkMode ? "right-0.5" : "right-6"
                }`}
              />
            </button>
          </div>

          {/* Notifications toggle */}
          <div className="flex items-center justify-between bg-desktop-surface border border-desktop-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-desktop-accent" />
              <div>
                <p className="font-medium">اعلان‌ها</p>
                <p className="text-sm text-desktop-text-muted">دریافت اعلان‌های سیستم</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? "bg-desktop-accent" : "bg-desktop-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  notifications ? "right-0.5" : "right-6"
                }`}
              />
            </button>
          </div>

          {/* RTL toggle */}
          <div className="flex items-center justify-between bg-desktop-surface border border-desktop-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-desktop-accent" />
              <div>
                <p className="font-medium">راست به چپ (RTL)</p>
                <p className="text-sm text-desktop-text-muted">جهت نمایش رابط کاربری</p>
              </div>
            </div>
            <button
              onClick={() => setRtl(!rtl)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                rtl ? "bg-desktop-accent" : "bg-desktop-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  rtl ? "right-0.5" : "right-6"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
