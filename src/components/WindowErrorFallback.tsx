import { AlertTriangle, RefreshCw } from "lucide-react";

interface WindowErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
}

/**
 * Error fallback displayed inside a crashed window.
 * Only the affected window shows this — the rest of the desktop stays functional.
 */
export default function WindowErrorFallback({
  error,
  resetErrorBoundary,
  title = "خطا در برنامه",
}: WindowErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center h-full p-6" dir="rtl">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/15 mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        <h3 className="text-lg font-semibold text-desktop-text mb-2">{title}</h3>

        <p className="text-sm text-desktop-text-muted mb-1">
          مشکلی در اجرای این برنامه پیش آمد.
        </p>

        <p className="text-xs text-red-400/80 font-mono bg-red-500/10 rounded-lg px-3 py-2 mb-4 select-text direction-ltr text-left">
          {error.message || "Unknown error"}
        </p>

        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-4 py-2 bg-desktop-accent hover:bg-desktop-accent-hover text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
