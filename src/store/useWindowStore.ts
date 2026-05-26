import { create } from "zustand";
import type { WindowType, OpenWindowParams, WindowPosition, WindowSize } from "./types";

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

  // Actions
  openWindow: (params: OpenWindowParams) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: WindowPosition) => void;
  updateWindowSize: (id: string, size: WindowSize) => void;
  setPaletteOpen: (open: boolean) => void;
}

/** Calculate a cascading position based on how many windows are open */
function getCascadePosition(windowCount: number): WindowPosition {
  return {
    x: 100 + (windowCount % 8) * CASCADE_OFFSET,
    y: 50 + (windowCount % 8) * CASCADE_OFFSET,
  };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  topZIndex: 10,
  activeWindowId: null,
  isPaletteOpen: false,

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
    };

    set((state) => ({
      windows: { ...state.windows, [params.id]: newWindow },
      topZIndex: state.topZIndex + 1,
      activeWindowId: params.id,
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
      // Switch focus to the next top-most non-minimized window
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

  setPaletteOpen: (open: boolean) => {
    set({ isPaletteOpen: open });
  },
}));
