import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

const metrics = [
  { label: "بازدید امروز", value: "۲۴,۵۸۱", change: "+۱۲%", up: true, icon: Eye },
  { label: "کاربران جدید", value: "۱,۲۳۴", change: "+۸%", up: true, icon: Users },
  { label: "نرخ تبدیل", value: "۳.۲٪", change: "-۲%", up: false, icon: TrendingUp },
];

export default function Analytics() {
  return (
    <div className="p-6 h-full overflow-auto" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-desktop-accent" />
        <h2 className="text-xl font-bold">تحلیل و آمار</h2>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-desktop-surface border border-desktop-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="w-4 h-4 text-desktop-text-muted" />
              <span className="text-sm text-desktop-text-muted">{m.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-desktop-text">{m.value}</span>
              <span className={`text-sm ${m.up ? "text-green-400" : "text-red-400"}`}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart visualization */}
      <div className="bg-desktop-surface border border-desktop-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">بازدید هفتگی</h3>
        <div className="h-48 flex items-end gap-3 justify-around">
          {[
            { day: "شنبه", val: 65 },
            { day: "یکشنبه", val: 80 },
            { day: "دوشنبه", val: 55 },
            { day: "سه‌شنبه", val: 90 },
            { day: "چهارشنبه", val: 70 },
            { day: "پنجشنبه", val: 45 },
            { day: "جمعه", val: 35 },
          ].map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs text-desktop-text-muted">{item.val}%</span>
              <div
                className="w-full bg-gradient-to-t from-desktop-accent to-desktop-accent/40 rounded-t-md"
                style={{ height: `${item.val}%` }}
              />
              <span className="text-xs text-desktop-text-muted">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
