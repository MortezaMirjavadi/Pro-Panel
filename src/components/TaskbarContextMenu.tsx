import * as ContextMenu from "@radix-ui/react-context-menu";
import { Focus, Minimize2, Maximize2, X } from "lucide-react";
import { useWindowStore } from "../store";
import type { ReactNode } from "react";

interface TaskbarContextMenuProps {
  windowId: string;
  isMinimized: boolean;
  isActive: boolean;
  children: ReactNode;
}

/**
 * Right-click context menu for a taskbar window item.
 * Options: Focus, Minimize/Restore, Close.
 */
export default function TaskbarContextMenu({
  windowId,
  isMinimized,
  isActive,
  children,
}: TaskbarContextMenuProps) {
  const { focusWindow, minimizeWindow, restoreWindow, closeWindow } = useWindowStore();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[160px] bg-desktop-surface border border-desktop-border rounded-xl p-1.5 shadow-xl z-[9999]"
          dir="rtl"
        >
          {/* Focus */}
          <ContextMenu.Item
            onSelect={() => {
              if (isMinimized) restoreWindow(windowId);
              focusWindow(windowId);
            }}
            disabled={isActive && !isMinimized}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-desktop-accent/20 text-desktop-text data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed transition-colors"
          >
            <Focus className="w-4 h-4 text-desktop-text-muted" />
            فوکوس
          </ContextMenu.Item>

          {/* Minimize / Restore */}
          <ContextMenu.Item
            onSelect={() => {
              if (isMinimized) {
                restoreWindow(windowId);
              } else {
                minimizeWindow(windowId);
              }
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-desktop-accent/20 text-desktop-text transition-colors"
          >
            {isMinimized ? (
              <>
                <Maximize2 className="w-4 h-4 text-desktop-text-muted" />
                بازگردانی
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4 text-desktop-text-muted" />
                حداقل کردن
              </>
            )}
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-px bg-desktop-border my-1" />

          {/* Close */}
          <ContextMenu.Item
            onSelect={() => closeWindow(windowId)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-red-500/20 text-desktop-text transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
            بستن
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
