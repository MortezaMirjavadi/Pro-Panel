/** Position of a window on the desktop */
export interface WindowPosition {
  x: number;
  y: number;
}

/** Dimensions of a window */
export interface WindowSize {
  width: number;
  height: number;
}

/** Full state shape for a single window */
export interface WindowType {
  id: string;
  title: string;
  /** Key used to look up the component in the registry */
  componentName: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
  /** Icon component name from lucide-react (optional) */
  icon?: string;
  /** Saved size before snapping, so we can restore on drag-away */
  preSnapSize?: WindowSize | null;
}

/** Parameters for opening a new window */
export interface OpenWindowParams {
  id: string;
  title: string;
  componentName: string;
  icon?: string;
  position?: WindowPosition;
  size?: WindowSize;
}

export type ThemeMode = "dark" | "light";
