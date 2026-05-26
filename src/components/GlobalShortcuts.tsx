import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { useWindowStore } from "../store";

/**
 * Invisible component that registers global keyboard shortcuts.
 * Render once in the app root.
 */
export default function GlobalShortcuts() {
  const {
    isPaletteOpen,
    setPaletteOpen,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    toggleShowDesktop,
    windows,
  } = useWindowStore();

  /** Ctrl+K / Cmd+K → Toggle command palette */
  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setPaletteOpen(!isPaletteOpen);
  }, { enableOnFormTags: true });

  /** Alt+W → Close active window */
  useHotkeys("alt+w", (e) => {
    e.preventDefault();
    if (activeWindowId && windows[activeWindowId]) {
      const title = windows[activeWindowId].title;
      closeWindow(activeWindowId);
      toast.info(`پنجره "${title}" بسته شد`);
    }
  }, { enableOnFormTags: true });

  /** Alt+M → Minimize active window */
  useHotkeys("alt+m", (e) => {
    e.preventDefault();
    if (activeWindowId && windows[activeWindowId]) {
      minimizeWindow(activeWindowId);
      toast.info(`پنجره "${windows[activeWindowId].title}" حداقل شد`);
    }
  }, { enableOnFormTags: true });

  /** Alt+D → Toggle Show Desktop */
  useHotkeys("alt+d", (e) => {
    e.preventDefault();
    toggleShowDesktop();
    toast.info("نمایش دسکتاپ");
  }, { enableOnFormTags: true });

  return null;
}
