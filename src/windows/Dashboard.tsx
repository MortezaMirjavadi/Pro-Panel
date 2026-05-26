import { useState, useCallback } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useEventBus } from "../lib/useEventBus";
import { toast } from "sonner";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(12458);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  /** Listen for REFRESH_DATA events from other windows */
  const handleRefresh = useCallback(
    (payload: { target: string }) => {
      if (payload.target === "dashboard") {
        // Simulate updating the user count
        setUserCount((prev) => prev + 1);
        setLastRefresh(new Date().toLocaleTimeString("fa-IR"));
        toast.info("داشبورد به‌روزرسانی شد — کاربر جدید شناسایی شد");
      }
    },
    []
  );

  /** Listen for NOTIFY events too */
  const handleNotify = useCallback(
    (payload: { message: string; type?: string }) => {
      toast(payload.message, { description: "از پنجره دیگر" });
    },
    []
  );

  useEventBus("REFRESH_DATA", handleRefresh);
  useEventBus("NOTIFY", handleNotify);

  const stats = [
    { label: "کل کاربران", value: userCount.toLocaleString("fa-IR"), icon: Users, color: "bg-blue-500/20 text-blue-400" },
    { label: "فروش امروز", value: "۸,۲۳۰,۰۰۰", icon: ShoppingCart, color: "bg-green-500/20 text-green-400" },
    { label: "درآمد ماه", value: "۱۲۵,۰۰۰,۰۰۰", icon: DollarSign, color: "bg-purple-500/20 text-purple-400" },
    { label: "بازدید لحظه‌ای", value: "۱,۲۳۴", icon: Activity, color: "bg-orange-500/20 text-orange-400" },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-desktop-accent" />
          <h2 className="text-xl font-bold">داشبورد مدیریت</h2>
        </div>
        {lastRefresh && (
          <span className="text-xs text-desktop-text-muted flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            آخرین به‌روزرسانی: {lastRefresh}
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-desktop-surface border border-desktop-border rounded-xl p-4 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-desktop-text-muted text-sm">{stat.label}</p>
              <p className="text-lg font-bold text-desktop-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="bg-desktop-surface border border-desktop-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-desktop-accent" />
          <h3 className="font-semibold">نمودار فروش ماهانه</h3>
        </div>
        <div className="h-40 flex items-end gap-2 justify-center">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
            <div
              key={i}
              className="w-8 bg-desktop-accent/60 rounded-t-md transition-all hover:bg-desktop-accent"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-desktop-text-muted">
          <span>فروردین</span>
          <span>اردیبهشت</span>
          <span>خرداد</span>
          <span>تیر</span>
          <span>مرداد</span>
          <span>شهریور</span>
        </div>
      </div>
    </div>
  );
}
