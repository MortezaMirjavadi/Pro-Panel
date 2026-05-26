import MillerColumnItem from "./MillerColumnItem";
import type { MillerColumn as MillerColumnType } from "./types";

interface MillerColumnProps {
  column: MillerColumnType;
  columnIndex: number;
  pinnedApps: string[];
  onSelect: (itemId: string) => void;
}

export default function MillerColumn({
  column,
  columnIndex,
  pinnedApps,
  onSelect,
}: MillerColumnProps) {
  return (
    <div
      className="w-64 shrink-0 border-l border-desktop-border bg-desktop-surface/30 flex flex-col h-full"
      data-column-index={columnIndex}
    >
      {/* Column header */}
      {column.parentItem && (
        <div className="px-3 py-2.5 border-b border-desktop-border">
          <span className="text-xs font-medium text-desktop-text-muted uppercase tracking-wider">
            {column.parentItem.title}
          </span>
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {column.items.map((item) => (
          <MillerColumnItem
            key={item.id}
            item={item}
            isSelected={column.selectedId === item.id}
            isPinned={pinnedApps.includes(item.id)}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
