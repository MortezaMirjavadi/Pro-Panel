import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

const events = [
  { day: 3, title: "جلسه تیم فنی", time: "۱۰:۰۰", color: "bg-blue-500" },
  { day: 5, title: "ددلاین پروژه", time: "تمام روز", color: "bg-red-500" },
  { day: 8, title: "ارائه به کارفرما", time: "۱۴:۰۰", color: "bg-purple-500" },
  { day: 12, title: "کد ریویو", time: "۱۱:۰۰", color: "bg-green-500" },
  { day: 15, title: "برنامه‌ریزی اسپرینت", time: "۰۹:۰۰", color: "bg-orange-500" },
  { day: 20, title: "انتشار نسخه جدید", time: "۱۶:۰۰", color: "bg-desktop-accent" },
];

const daysOfWeek = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function Calendar() {
  const [currentMonth] = useState("خرداد ۱۴۰۵");

  // Generate a simple 5x7 grid for the month
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptyStart = 5; // Saturday start offset for demo

  return (
    <div className="p-6 h-full overflow-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-desktop-accent" />
          <h2 className="text-xl font-bold">{currentMonth}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-desktop-surface transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-desktop-surface transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-desktop-surface border border-desktop-border rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-7 border-b border-desktop-border">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-desktop-text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: emptyStart }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 min-h-[80px] border-b border-l border-desktop-border/30" />
          ))}
          {days.map((day) => {
            const dayEvents = events.filter((e) => e.day === day);
            return (
              <div
                key={day}
                className={`p-2 min-h-[80px] border-b border-l border-desktop-border/30 hover:bg-desktop-border/20 cursor-pointer transition-colors ${
                  day === 5 ? "bg-desktop-accent/10" : ""
                }`}
              >
                <span className={`text-sm ${day === 5 ? "text-desktop-accent font-bold" : ""}`}>
                  {day}
                </span>
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`mt-1 ${event.color} rounded px-1.5 py-0.5 text-xs text-white truncate`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
