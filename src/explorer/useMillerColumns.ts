import { useState, useMemo, useCallback } from "react";
import type { MenuItem, MillerColumn } from "./types";
import { menuData } from "./menuData";
import { useAuthStore } from "../store/authStore";
import { filterMenuByRole, flattenFilteredTerminalItems } from "../lib/rbac";

/**
 * Hook managing Miller Columns navigation state.
 *
 * - `path`: array of selected item IDs, one per column level.
 * - `columns`: derived from `path` — each entry is a MillerColumn
 *   containing the items to display at that depth.
 * - `searchQuery` / `searchResults`: for the root column's search bar.
 * - All data is filtered by the current user's role (RBAC).
 */
export function useMillerColumns() {
  const [path, setPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = useAuthStore((s) => s.user?.role ?? null);

  /** Menu tree filtered by the current user's role */
  const filteredMenuData = useMemo(
    () => filterMenuByRole(menuData, userRole),
    [userRole]
  );

  /** All terminal items from the filtered tree */
  const allTerminalItems = useMemo(
    () => flattenFilteredTerminalItems(filteredMenuData),
    [filteredMenuData]
  );

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
   * Column 0 is always the root (filteredMenuData).
   */
  const columns: MillerColumn[] = useMemo(() => {
    const result: MillerColumn[] = [];

    // Column 0: root
    result.push({
      parentItem: null,
      items: filteredMenuData,
      selectedId: path[0] ?? null,
    });

    // Walk the tree following the path
    let currentItems = filteredMenuData;
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
        break;
      }
    }

    return result;
  }, [path, filteredMenuData]);

  /** Find a menu item by ID in the filtered tree */
  const findItem = useCallback(
    (id: string): MenuItem | null => {
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
      return search(filteredMenuData);
    },
    [filteredMenuData]
  );

  const selectItem = useCallback(
    (columnIndex: number, itemId: string) => {
      const item = findItem(itemId);
      if (!item) return;

      const newPath = [...path.slice(0, columnIndex), itemId];
      setPath(newPath);
      setSearchQuery("");
    },
    [path, findItem]
  );

  const goToColumn = useCallback((columnIndex: number) => {
    setPath((prev) => prev.slice(0, columnIndex));
    setSearchQuery("");
  }, []);

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
