import { Star } from "lucide-react";
import { useWindowStore } from "../store";
import type { MenuItem } from "./types";

interface MillerColumnItemProps {
  item: MenuItem;
  isSelected: boolean;
  isPinned: boolean;
  onSelect: () => void;
}

export default function MillerColumnItem({
  item,
  isSelected,
  isPinned,
  onSelect,
}: MillerColumnItemProps) {
  const { togglePin } = useWindowStore();
  const hasChildren = !!item.children && item.children.length > 0;
  const isTerminal = !!item.componentName;

  const Icon = item.icon;

  return (
    <div
      className={`group flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
        isSelected
          ? "bg-desktop-accent/20 text-desktop-accent"
          : "hover:bg-desktop-border/40 text-desktop-text"
      }`}
      onClick={onSelect}
    >
      {/* Icon */}
      {Icon && <Icon className="w-4 h-4 shrink-0" />}

      {/* Title */}
      <span className="flex-1 text-sm truncate">{item.title}</span>

      {/* Pin/Star button — only for terminal items */}
      {isTerminal && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(item.id);
          }}
          className={`p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${
            isPinned ? "!opacity-100 text-yellow-400" : "text-desktop-text-muted hover:text-yellow-400"
          }`}
          title={isPinned ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        >
          <Star className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} />
        </button>
      )}

      {/* Arrow for items with children (pointing left in RTL) */}
      {hasChildren && (
        <span className="text-xs text-desktop-text-muted shrink-0">⬅</span>
      )}
    </div>
  );
}
