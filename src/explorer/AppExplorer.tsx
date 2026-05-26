import { useRef, useEffect, useCallback, useMemo } from "react";
import { Search, Star, X, LayoutDashboard } from "lucide-react";
import { useMillerColumns } from "./useMillerColumns";
import { useWindowStore } from "../store";
import MillerColumn from "./MillerColumn";
import MillerColumnItem from "./MillerColumnItem";
import type { MenuItem } from "./types";
import { flattenFilteredTerminalItems } from "../lib/rbac";

export default function AppExplorer() {
  const { openWindow, pinnedApps } = useWindowStore();
  const {
    columns,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectItem,
    findItem,
  } = useMillerColumns();

  const scrollRef = useRef<HTMLDivElement>(null);

  /** Root-level items (already filtered by role via useMillerColumns) */
  const rootItems = columns[0]?.items ?? [];

  /** All terminal items from the filtered tree (for pinned lookup) */
  const allFilteredTerminal = useMemo(
    () => flattenFilteredTerminalItems(rootItems),
    [rootItems]
  );

  /** Auto-scroll to the far left (newest column) when path deepens */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [columns.length]);

  /** Handle clicking a terminal item → open window, not a column */
  const handleItemClick = useCallback(
    (columnIndex: number, itemId: string) => {
      const item = findItem(itemId);
      if (!item) return;

      if (item.componentName) {
        openWindow({
          id: item.id,
          title: item.title,
          componentName: item.componentName,
        });
      } else if (item.children && item.children.length > 0) {
        selectItem(columnIndex, itemId);
      }
    },
    [findItem, openWindow, selectItem]
  );

  /** Handle selecting a search result → open the window */
  const handleSearchSelect = useCallback(
    (item: MenuItem) => {
      if (item.componentName) {
        openWindow({
          id: item.id,
          title: item.title,
          componentName: item.componentName,
        });
        setSearchQuery("");
      }
    },
    [openWindow, setSearchQuery]
  );

  /** Get pinned item objects (filtered by role) */
  const pinnedItems = pinnedApps
    .map((id) => allFilteredTerminal.find((item) => item.id === id))
    .filter(Boolean) as MenuItem[];

  return (
    <div className="h-full flex flex-col" dir="rtl">
      {/* ── Horizontally scrolling columns container ── */}
      <div
        ref={scrollRef}
        className="flex-1 flex flex-row overflow-x-auto custom-scrollbar"
        style={{ direction: "rtl" }}
      >
        {/* ── Root Column (Special: Search + Favorites + Categories) ── */}
        <div className="w-72 shrink-0 border-l border-desktop-border bg-desktop-surface/50 flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-desktop-border">
            <span className="text-sm font-bold text-desktop-accent">کاوشگر برنامه‌ها</span>
          </div>

          {/* Search Input */}
          <div className="p-3 border-b border-desktop-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-desktop-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی برنامه..."
                className="w-full bg-desktop-surface border border-desktop-border rounded-lg pr-10 pl-8 py-2 text-sm outline-none focus:border-desktop-accent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-desktop-border/50"
                >
                  <X className="w-3.5 h-3.5 text-desktop-text-muted" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 max-h-48 overflow-y-auto custom-scrollbar rounded-lg border border-desktop-border bg-desktop-bg">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-center text-sm text-desktop-text-muted">
                    نتیجه‌ای یافت نشد
                  </div>
                ) : (
                  searchResults.map((item) => {
                    const Icon = item.icon ?? LayoutDashboard;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSearchSelect(item)}
                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-desktop-accent/20 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-desktop-accent shrink-0" />
                        <span className="text-sm text-desktop-text truncate">{item.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Pinned / Favorites Section */}
          {pinnedItems.length > 0 && !searchQuery.trim() && (
            <div className="border-b border-desktop-border">
              <div className="px-4 py-2 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-medium text-desktop-text-muted uppercase tracking-wider">
                  علاقه‌مندی‌ها
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto custom-scrollbar">
                {pinnedItems.map((item) => (
                  <MillerColumnItem
                    key={`pinned-${item.id}`}
                    item={item}
                    isSelected={false}
                    isPinned={true}
                    onSelect={() => handleSearchSelect(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Categories Header */}
          {!searchQuery.trim() && (
            <div className="px-4 py-2 flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-desktop-text-muted" />
              <span className="text-xs font-medium text-desktop-text-muted uppercase tracking-wider">
                دسته‌بندی‌ها
              </span>
            </div>
          )}

          {/* Root-level menu items (filtered by role) */}
          {!searchQuery.trim() && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {rootItems.map((item) => (
                <MillerColumnItem
                  key={item.id}
                  item={item}
                  isSelected={columns[0]?.selectedId === item.id}
                  isPinned={pinnedApps.includes(item.id)}
                  onSelect={() => handleItemClick(0, item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Child Columns (from navigation path) ── */}
        {columns.slice(1).map((column, index) => (
          <MillerColumn
            key={`col-${index + 1}-${column.parentItem?.id}`}
            column={column}
            columnIndex={index + 1}
            pinnedApps={pinnedApps}
            onSelect={(itemId) => handleItemClick(index + 1, itemId)}
          />
        ))}
      </div>
    </div>
  );
}
