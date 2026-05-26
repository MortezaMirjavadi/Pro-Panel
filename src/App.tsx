import { useWindowStore } from "./store";
import Sidebar from "./components/Sidebar";
import Taskbar from "./components/Taskbar";
import DynamicWindow from "./components/DynamicWindow";
import CommandPalette from "./components/CommandPalette";

export default function App() {
  const { windows } = useWindowStore();
  const allWindows = Object.values(windows);

  return (
    <div dir="rtl" className="h-screen w-screen flex flex-col overflow-hidden bg-desktop-bg select-none">
      {/* ── Main Content Area ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (right side in RTL) */}
        <Sidebar />

        {/* Desktop Area — windows render here */}
        <main className="flex-1 relative overflow-hidden">
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #6c5ce7 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Windows */}
          {allWindows.map((win) => (
            <DynamicWindow key={win.id} window={win} />
          ))}

          {/* Empty state when no windows are open */}
          {allWindows.length === 0 && (
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
        </main>
      </div>

      {/* ── Taskbar (bottom) ── */}
      <Taskbar />

      {/* ── Command Palette (overlay) ── */}
      <CommandPalette />
    </div>
  );
}
