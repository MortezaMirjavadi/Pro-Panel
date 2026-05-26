import type { LucideIcon } from "lucide-react";

/** Recursive menu item — supports N-level nesting */
export interface MenuItem {
  id: string;
  title: string;
  /** Lucide icon component (optional, used for terminal nodes) */
  icon?: LucideIcon;
  /** If present, this is a terminal node that opens a window */
  componentName?: string;
  /** If present, this item has children (branch node) */
  children?: MenuItem[];
}

/** A column in the Miller Columns view — represents one level of the tree */
export interface MillerColumn {
  /** The parent item whose children are displayed in this column */
  parentItem: MenuItem | null;
  /** The items to display in this column */
  items: MenuItem[];
  /** The ID of the selected item in this column (null if none) */
  selectedId: string | null;
}
