/** Shimmering skeleton placeholder shown while a window's content loads */
export default function WindowSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse" dir="rtl">
      {/* Header bar skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-desktop-surface" />
        <div className="h-5 w-36 rounded bg-desktop-surface" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-desktop-surface border border-desktop-border rounded-xl p-4 space-y-3">
            <div className="h-4 w-20 rounded bg-desktop-border" />
            <div className="h-7 w-16 rounded bg-desktop-border" />
          </div>
        ))}
      </div>

      {/* Large block skeleton */}
      <div className="bg-desktop-surface border border-desktop-border rounded-xl p-6 space-y-3">
        <div className="h-4 w-28 rounded bg-desktop-border" />
        <div className="h-32 rounded-lg bg-desktop-border" />
        <div className="flex gap-2">
          <div className="h-3 w-16 rounded bg-desktop-border" />
          <div className="h-3 w-12 rounded bg-desktop-border" />
          <div className="h-3 w-20 rounded bg-desktop-border" />
        </div>
      </div>
    </div>
  );
}
