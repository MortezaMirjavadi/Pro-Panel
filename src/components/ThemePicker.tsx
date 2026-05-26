import { Palette, Check } from "lucide-react";
import { useWindowStore } from "../store";
import { themes, getThemeById } from "../lib/themes";
import { toast } from "sonner";

export default function ThemePicker() {
  const { theme, setTheme } = useWindowStore();
  const currentTheme = getThemeById(theme);

  return (
    <div className="p-6 h-full overflow-auto" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-6 h-6 text-desktop-accent" />
        <h2 className="text-xl font-bold">انتخاب تم</h2>
      </div>

      <p className="text-sm text-desktop-text-muted mb-6">
        تم مورد نظر خود را انتخاب کنید. تغییرات بلافاصله اعمال می‌شوند.
      </p>

      {/* Current theme preview */}
      <div className="bg-desktop-surface border border-desktop-border rounded-xl p-4 mb-6">
        <p className="text-xs text-desktop-text-muted mb-2">تم فعلی</p>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border-2 border-desktop-accent"
            style={{ background: currentTheme.preview }}
          />
          <div>
            <p className="font-medium">{currentTheme.name}</p>
            <p className="text-sm text-desktop-text-muted">{currentTheme.nameEn}</p>
          </div>
        </div>
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-2 gap-4">
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                toast.success(`تم "${t.name}" فعال شد`);
              }}
              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${
                isSelected
                  ? "border-desktop-accent bg-desktop-surface shadow-lg"
                  : "border-desktop-border bg-desktop-surface/50 hover:border-desktop-accent/40 hover:bg-desktop-surface"
              }`}
            >
              {/* Color preview swatch */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-bg"] }}
                  />
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-surface"] }}
                  />
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-accent"] }}
                  />
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-taskbar"] }}
                  />
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-text"] }}
                  />
                  <div
                    className="w-5 h-5 rounded"
                    style={{ background: t.colors["--color-border"] }}
                  />
                </div>
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{t.name}</p>
                <p className="text-xs text-desktop-text-muted truncate">{t.nameEn}</p>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2 left-2">
                  <Check className="w-4 h-4 text-desktop-accent" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
