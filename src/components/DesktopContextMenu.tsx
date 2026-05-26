import * as ContextMenu from "@radix-ui/react-context-menu";
import { Monitor, XCircle, Image, LayoutGrid } from "lucide-react";
import { useWindowStore } from "../store";
import { toast } from "sonner";
import type { ReactNode } from "react";

interface DesktopContextMenuProps {
  children: ReactNode;
}

/**
 * Right-click context menu for the desktop background.
 * Options: Change Wallpaper, Show Desktop, Close All Windows.
 */
export default function DesktopContextMenu({ children }: DesktopContextMenuProps) {
  const { toggleShowDesktop, closeAllWindows, setWallpaper, windows } = useWindowStore();
  const hasWindows = Object.keys(windows).length > 0;

  const wallpapers = [
    { label: "پیش‌فرض (بدون والپیپر)", url: "" },
    { label: "گرادیانت بنفش", url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { label: "گرادیانت آبی", url: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
    { label: "گرادیانت سبز", url: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  ];

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content
          className="min-w-[200px] bg-desktop-surface border border-desktop-border rounded-xl p-1.5 shadow-xl z-[9999]"
          dir="rtl"
        >
          {/* Show Desktop */}
          <ContextMenu.Item
            onSelect={() => {
              toggleShowDesktop();
              toast.info("نمایش دسکتاپ");
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-desktop-accent/20 text-desktop-text transition-colors"
          >
            <Monitor className="w-4 h-4 text-desktop-text-muted" />
            نمایش دسکتاپ
          </ContextMenu.Item>

          {/* Close All Windows */}
          <ContextMenu.Item
            onSelect={() => {
              if (hasWindows) {
                closeAllWindows();
                toast.info("همه پنجره‌ها بسته شدند");
              }
            }}
            disabled={!hasWindows}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-red-500/20 text-desktop-text data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-4 h-4 text-desktop-text-muted" />
            بستن همه پنجره‌ها
          </ContextMenu.Item>

          <ContextMenu.Separator className="h-px bg-desktop-border my-1" />

          {/* Wallpaper submenu */}
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-desktop-accent/20 text-desktop-text data-[state=open]:bg-desktop-accent/20 transition-colors">
              <Image className="w-4 h-4 text-desktop-text-muted" />
              تغییر والپیپر
              <span className="mr-auto text-xs text-desktop-text-muted">◀</span>
            </ContextMenu.SubTrigger>

            <ContextMenu.Portal>
              <ContextMenu.SubContent
                className="min-w-[180px] bg-desktop-surface border border-desktop-border rounded-xl p-1.5 shadow-xl z-[9999]"
                sideOffset={4}
                dir="rtl"
              >
                {wallpapers.map((wp) => (
                  <ContextMenu.Item
                    key={wp.label}
                    onSelect={() => {
                      setWallpaper(wp.url);
                      toast.success("والپیپر تغییر کرد");
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg cursor-pointer outline-none hover:bg-desktop-accent/20 text-desktop-text transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4 text-desktop-text-muted" />
                    {wp.label}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
