import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WindowType, OpenWindowParams, WindowPosition, WindowSize, ThemeMode } from "./types";

/** Default window size */
const DEFAULT_SIZE: WindowSize = { width: 800, height: 500 };

/** Cascade offset so stacked windows don't perfectly overlap */
const CASCADE_OFFSET = 30;

interface WindowStore {
  /** All managed windows keyed by id */
  windows: Record<string, WindowType>;
  /** Tracks the highest z-index to assign the next focused window */
  topZIndex: number;
  /** ID of the currently active/focused window (null if none) */
  activeWindowId: string | null;
  /** Whether the command palette is open */
  isPaletteOpen: boolean;
  /** Whether all windows are minimized (Show Desktop mode) */
  showDesktop: boolean;
  /** Theme mode: dark or light */
  theme: ThemeMode;
  /** Custom wallpaper URL (empty string = default grid pattern) */
  wallpaper: string;
  /** Pinned/favorite app IDs (persisted) */
  pinnedApps: string[];

  // Actions
  openWindow: (params: OpenWindowParams) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  updateWindowSnap: (id: string, size: WindowSize, preSnapSize: WindowSize | null) => void;
  closeAllWindows: () => void;
  minimizeAllWindows: () => void;
  restoreAllWindows: () => void;
  toggleShowDesktop: () => void;
  setPaletteOpen: (open: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  setWallpaper: (url: string) => void;
  togglePin: (appId: string) => void;
}

/** Calculate a cascading position based on how many windows are open */
function getCascadePosition(windowCount: number): WindowPosition {
  return {
    x: 100 + (windowCount % 8) * CASCADE_OFFSET,
    y: 50 + (windowCount % 8) * CASCADE_OFFSET,
  };
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: {},
      topZIndex: 10,
      activeWindowId: null,
      isPaletteOpen: false,
      showDesktop: false,
      theme: "dark",
      wallpaper: "",
      pinnedApps: [],

      openWindow: (params: OpenWindowParams) => {
        const { windows, topZIndex } = get();
        const existing = windows[params.id];

        // If the window already exists, just focus and un-minimize it
        if (existing) {
          set((state) => ({
            windows: {
              ...state.windows,
              [params.id]: {
                ...state.windows[params.id],
                isMinimized: false,
                zIndex: state.topZIndex + 1,
              },
            },
            topZIndex: state.topZIndex + 1,
            activeWindowId: params.id,
            showDesktop: false,
          }));
          return;
        }

        // Calculate position: use provided or cascade
        const openCount = Object.keys(windows).length;
        const position = params.position ?? getCascadePosition(openCount);
        const size = params.size ?? DEFAULT_SIZE;

        const newWindow: WindowType = {
          id: params.id,
          title: params.title,
          componentName: params.componentName,
          isMinimized: false,
          isMaximized: false,
          zIndex: topZIndex + 1,
          position,
          size,
          icon: params.icon,
          preSnapSize: null,
        };

        set((state) => ({
          windows: { ...state.windows, [params.id]: newWindow },
          topZIndex: state.topZIndex + 1,
          activeWindowId: params.id,
          showDesktop: false,
        }));
      },

      closeWindow: (id: string) => {
        set((state) => {
          const { [id]: _removed, ...rest } = state.windows;
          const newActive =
            state.activeWindowId === id
              ? Object.values(rest).sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
              : state.activeWindowId;
          return { windows: rest, activeWindowId: newActive };
        });
      },

      minimizeWindow: (id: string) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMinimized: true },
          },
          activeWindowId:
            state.activeWindowId === id
              ? Object.values(state.windows)
                  .filter((w) => w.id !== id && !w.isMinimized)
                  .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
              : state.activeWindowId,
        }));
      },

      maximizeWindow: (id: string) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMaximized: true },
          },
        }));
      },

      restoreWindow: (id: string) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMaximized: false, isMinimized: false },
          },
        }));
      },

      focusWindow: (id: string) => {
        const { windows, topZIndex } = get();
        if (!windows[id]) return;

        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], zIndex: state.topZIndex + 1 },
          },
          topZIndex: state.topZIndex + 1,
          activeWindowId: id,
        }));
      },

      updateWindowPosition: (id: string, position: WindowPosition) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], position },
          },
        }));
      },

      updateWindowSize: (id: string, size: WindowSize) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: { ...state.windows[id], size },
          },
        }));
      },

      /** Update position + size after a snap, and store preSnapSize for restore */
      updateWindowSnap: (id: string, size: WindowSize, preSnapSize: WindowSize | null) => {
        set((state) => ({
          windows: {
            ...state.windows,
            [id]: {
              ...state.windows[id],
              size,
              position: { x: 0, y: 0 },
              preSnapSize,
            },
          },
        }));
      },

      closeAllWindows: () => {
        set({ windows: {}, activeWindowId: null, showDesktop: false });
      },

      /** Minimize all windows and enter "Show Desktop" mode */
      minimizeAllWindows: () => {
        set((state) => {
          const updated: Record<string, WindowType> = {};
          for (const [id, win] of Object.entries(state.windows)) {
            updated[id] = { ...win, isMinimized: true };
          }
          return { windows: updated, activeWindowId: null, showDesktop: true };
        });
      },

      /** Restore all minimized windows and exit "Show Desktop" mode */
      restoreAllWindows: () => {
        set((state) => {
          const updated: Record<string, WindowType> = {};
          for (const [id, win] of Object.entries(state.windows)) {
            updated[id] = { ...win, isMinimized: false };
          }
          // Focus the top-most window
          const topWin = Object.values(updated).sort((a, b) => b.zIndex - a.zIndex)[0];
          return {
            windows: updated,
            activeWindowId: topWin?.id ?? null,
            showDesktop: false,
          };
        });
      },

      /** Toggle Show Desktop: minimize all or restore all */
      toggleShowDesktop: () => {
        const { showDesktop } = get();
        if (showDesktop) {
          get().restoreAllWindows();
        } else {
          get().minimizeAllWindows();
        }
      },

      setPaletteOpen: (open: boolean) => {
        set({ isPaletteOpen: open });
      },

      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },

      setWallpaper: (url: string) => {
        set({ wallpaper: url });
      },

      togglePin: (appId: string) => {
        set((state) => {
          const isPinned = state.pinnedApps.includes(appId);
          return {
            pinnedApps: isPinned
              ? state.pinnedApps.filter((id) => id !== appId)
              : [...state.pinnedApps, appId],
          };
        });
      },
    }),
    {
      name: "pro-panel-storage",
      /** Only persist primitive/data fields — never React components or functions */
      partialize: (state) => ({
        windows: state.windows,
        topZIndex: state.topZIndex,
        activeWindowId: state.activeWindowId,
        theme: state.theme,
        wallpaper: state.wallpaper,
        pinnedApps: state.pinnedApps,
      }),
    }
  )
);
