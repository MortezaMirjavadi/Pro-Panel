import { useState, useMemo, useCallback } from "react";
import type { MenuItem, MillerColumn } from "./types";
import { menuData, flattenTerminalItems } from "./menuData";

/**
 * Hook managing Miller Columns navigation state.
 *
 * - `path`: array of selected item IDs, one per column level.
 *   e.g. ["settings", "settings-appearance", "appearance-theme"]
 *   means the user clicked Settings → Appearance → Theme.
 *
 * - `columns`: derived from `path` — each entry is a MillerColumn
 *   containing the items to display at that depth.
 *
 * - `searchQuery` / `searchResults`: for the root column's search bar.
 */
export function useMillerColumns() {
  /** The selected path of item IDs */
  const [path, setPath] = useState<string[]>([]);
  /** Current search query in the root column */
  const [searchQuery, setSearchQuery] = useState("");

  /** All terminal (leaf) items for search */
  const allTerminalItems = useMemo(() => flattenTerminalItems(menuData), []);

  /** Search results filtered by query */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return allTerminalItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [searchQuery, allTerminalItems]);

  /**
   * Build the column list from the current path.
   * Column 0 is always the root (menuData).
   * Each subsequent column is the children of the selected item in the previous column.
   */
  const columns: MillerColumn[] = useMemo(() => {
    const result: MillerColumn[] = [];

    // Column 0: root
    result.push({
      parentItem: null,
      items: menuData,
      selectedId: path[0] ?? null,
    });

    // Walk the tree following the path
    let currentItems = menuData;
    for (let i = 0; i < path.length; i++) {
      const selectedId = path[i];
      const selectedItem = currentItems.find((item) => item.id === selectedId);

      if (selectedItem?.children && selectedItem.children.length > 0) {
        result.push({
          parentItem: selectedItem,
          items: selectedItem.children,
          selectedId: path[i + 1] ?? null,
        });
        currentItems = selectedItem.children;
      } else {
        // Terminal node — no more columns
        break;
      }
    }

    return result;
  }, [path]);

  /** Find a menu item by ID in the tree */
  const findItem = useCallback((id: string): MenuItem | null => {
    function search(items: MenuItem[]): MenuItem | null {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = search(item.children);
          if (found) return found;
        }
      }
      return null;
    }
    return search(menuData);
  }, []);

  /**
   * Select an item in a given column.
   * - If the item has children → extend the path to open a new column.
   * - If the item is terminal → truncate the path to this column level.
   */
  const selectItem = useCallback(
    (columnIndex: number, itemId: string) => {
      const item = findItem(itemId);
      if (!item) return;

      // Truncate path to the clicked column level, then set the new selection
      const newPath = [...path.slice(0, columnIndex), itemId];
      setPath(newPath);
      setSearchQuery("");
    },
    [path, findItem]
  );

  /** Navigate back to a specific column (click on a breadcrumb or column header) */
  const goToColumn = useCallback((columnIndex: number) => {
    setPath((prev) => prev.slice(0, columnIndex));
    setSearchQuery("");
  }, []);

  /** Reset to root */
  const reset = useCallback(() => {
    setPath([]);
    setSearchQuery("");
  }, []);

  return {
    path,
    columns,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectItem,
    goToColumn,
    reset,
    findItem,
  };
}
