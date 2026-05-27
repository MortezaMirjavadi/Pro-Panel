import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { featureRegistry } from "./lib/FeatureRegistry";
import WindowSkeleton from "./components/WindowSkeleton";
import "./styles/globals.css";

/**
 * Standalone popout page entry point.
 * Reads the component name from URL params: /popout.html?component=dashboard
 * Renders the component in a minimal full-page wrapper.
 */
function PopoutApp() {
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("component");

  if (!appId) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <p className="text-desktop-text-muted">نام برنامه مشخص نشده است.</p>
      </div>
    );
  }

  const Component = featureRegistry.getComponent(appId);

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <p className="text-desktop-text-muted">برنامه "{appId}" یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-auto bg-desktop-bg" dir="rtl">
      <Suspense fallback={<WindowSkeleton />}>
        <Component />
      </Suspense>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("popout-root")!).render(<PopoutApp />);
