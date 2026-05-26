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
  /**
   * Role-based access control.
   * If undefined or empty, the item is accessible to all roles.
   * If set, only users with one of these roles can see/access this item.
   */
  allowedRoles?: string[];
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
