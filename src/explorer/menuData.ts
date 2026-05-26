import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Terminal,
  Shield,
  Bell,
  Palette,
  Globe,
  FileText,
  Image,
  Film,
  Music,
  Database,
  Server,
  Code,
  GitBranch,
  Smartphone,
  ShoppingCart,
  CreditCard,
  Package,
  TrendingUp,
  PieChart,
  Activity,
  UserCheck,
  UserPlus,
  Key,
  Lock,
  Cog,
  Brush,
  Languages,
  Mail,
  Phone,
  Map,
} from "lucide-react";
import type { MenuItem } from "./types";

/**
 * Deeply nested menu structure (4+ levels).
 * Terminal nodes have `componentName` (maps to the component registry).
 * Branch nodes have `children`.
 */
export const menuData: MenuItem[] = [
  // ── Dashboard ──
  {
    id: "dashboard",
    title: "داشبورد",
    icon: LayoutDashboard,
    componentName: "Dashboard",
  },

  // ── Users (branch) ──
  {
    id: "users",
    title: "کاربران",
    icon: Users,
    children: [
      {
        id: "users-list",
        title: "لیست کاربران",
        icon: UserCheck,
        componentName: "Users",
      },
      {
        id: "users-roles",
        title: "نقش‌ها و دسترسی‌ها",
        icon: Shield,
        children: [
          {
            id: "users-roles-admin",
            title: "مدیران سیستم",
            icon: Key,
            componentName: "Users",
          },
          {
            id: "users-roles-editor",
            title: "ویرایشگران",
            icon: Code,
            componentName: "Users",
          },
          {
            id: "users-roles-viewer",
            title: "بینندگان",
            icon: Users,
            componentName: "Users",
          },
          {
            id: "users-roles-permissions",
            title: "سطوح دسترسی",
            icon: Lock,
            children: [
              {
                id: "perm-read",
                title: "فقط خواندنی",
                icon: FileText,
                componentName: "Users",
              },
              {
                id: "perm-write",
                title: "خواندن و نوشتن",
                icon: Code,
                componentName: "Users",
              },
              {
                id: "perm-admin",
                title: "دسترسی کامل",
                icon: Shield,
                componentName: "Users",
              },
            ],
          },
        ],
      },
      {
        id: "users-add",
        title: "افزودن کاربر",
        icon: UserPlus,
        componentName: "Users",
      },
    ],
  },

  // ── Analytics (branch) ──
  {
    id: "analytics",
    title: "تحلیل‌ها",
    icon: BarChart3,
    children: [
      {
        id: "analytics-overview",
        title: "نمای کلی",
        icon: PieChart,
        componentName: "Analytics",
      },
      {
        id: "analytics-traffic",
        title: "ترافیک سایت",
        icon: TrendingUp,
        children: [
          {
            id: "traffic-realtime",
            title: "لحظه‌ای",
            icon: Activity,
            componentName: "Analytics",
          },
          {
            id: "traffic-sources",
            title: "منابع ورودی",
            icon: Globe,
            componentName: "Analytics",
          },
          {
            id: "traffic-pages",
            title: "پربازدیدترین صفحات",
            icon: FileText,
            componentName: "Analytics",
          },
        ],
      },
      {
        id: "analytics-reports",
        title: "گزارش‌ها",
        icon: FileText,
        children: [
          {
            id: "reports-daily",
            title: "گزارش روزانه",
            icon: Calendar,
            componentName: "Analytics",
          },
          {
            id: "reports-monthly",
            title: "گزارش ماهانه",
            icon: BarChart3,
            componentName: "Analytics",
          },
          {
            id: "reports-custom",
            title: "گزارش سفارشی",
            icon: Settings,
            componentName: "Analytics",
          },
        ],
      },
    ],
  },

  // ── File Manager (branch) ──
  {
    id: "file-manager",
    title: "مدیریت فایل",
    icon: FolderOpen,
    children: [
      {
        id: "files-documents",
        title: "اسناد",
        icon: FileText,
        componentName: "FileManager",
      },
      {
        id: "files-media",
        title: "رسانه‌ها",
        icon: Image,
        children: [
          {
            id: "media-images",
            title: "تصاویر",
            icon: Image,
            componentName: "FileManager",
          },
          {
            id: "media-videos",
            title: "ویدیو",
            icon: Film,
            componentName: "FileManager",
          },
          {
            id: "media-music",
            title: "موسیقی",
            icon: Music,
            componentName: "FileManager",
          },
        ],
      },
      {
        id: "files-downloads",
        title: "دانلودها",
        icon: FolderOpen,
        componentName: "FileManager",
      },
    ],
  },

  // ── Messages ──
  {
    id: "messages",
    title: "پیام‌ها",
    icon: MessageSquare,
    componentName: "Messages",
  },

  // ── Calendar ──
  {
    id: "calendar",
    title: "تقویم",
    icon: Calendar,
    componentName: "Calendar",
  },

  // ── Settings (deep branch) ──
  {
    id: "settings",
    title: "تنظیمات",
    icon: Settings,
    children: [
      {
        id: "settings-general",
        title: "عمومی",
        icon: Cog,
        componentName: "Settings",
      },
      {
        id: "settings-appearance",
        title: "ظاهر",
        icon: Palette,
        children: [
          {
            id: "appearance-theme",
            title: "قالب",
            icon: Brush,
            componentName: "Settings",
          },
          {
            id: "appearance-wallpaper",
            title: "والپیپر",
            icon: Image,
            componentName: "Settings",
          },
          {
            id: "appearance-fonts",
            title: "فونت‌ها",
            icon: FileText,
            componentName: "Settings",
          },
        ],
      },
      {
        id: "settings-notifications",
        title: "اعلان‌ها",
        icon: Bell,
        componentName: "Settings",
      },
      {
        id: "settings-security",
        title: "امنیت",
        icon: Shield,
        children: [
          {
            id: "security-2fa",
            title: "احراز هویت دو مرحله‌ای",
            icon: Lock,
            componentName: "Settings",
          },
          {
            id: "security-sessions",
            title: "نشست‌های فعال",
            icon: Smartphone,
            componentName: "Settings",
          },
          {
            id: "security-api",
            title: "کلیدهای API",
            icon: Key,
            componentName: "Settings",
          },
        ],
      },
      {
        id: "settings-language",
        title: "زبان و منطقه",
        icon: Languages,
        children: [
          {
            id: "lang-farsi",
            title: "فارسی",
            icon: Globe,
            componentName: "Settings",
          },
          {
            id: "lang-english",
            title: "English",
            icon: Globe,
            componentName: "Settings",
          },
          {
            id: "lang-arabic",
            title: "العربية",
            icon: Globe,
            componentName: "Settings",
          },
        ],
      },
    ],
  },

  // ── E-Commerce (branch) ──
  {
    id: "ecommerce",
    title: "فروشگاه",
    icon: ShoppingCart,
    children: [
      {
        id: "shop-products",
        title: "محصولات",
        icon: Package,
        children: [
          {
            id: "products-list",
            title: "لیست محصولات",
            icon: Package,
            componentName: "FileManager",
          },
          {
            id: "products-categories",
            title: "دسته‌بندی‌ها",
            icon: FolderOpen,
            componentName: "FileManager",
          },
          {
            id: "products-inventory",
            title: "موجودی انبار",
            icon: Database,
            componentName: "FileManager",
          },
        ],
      },
      {
        id: "shop-orders",
        title: "سفارشات",
        icon: ShoppingCart,
        componentName: "Analytics",
      },
      {
        id: "shop-payments",
        title: "پرداخت‌ها",
        icon: CreditCard,
        componentName: "Analytics",
      },
    ],
  },

  // ── Infrastructure (branch) ──
  {
    id: "infra",
    title: "زیرساخت",
    icon: Server,
    children: [
      {
        id: "infra-servers",
        title: "سرورها",
        icon: Server,
        componentName: "Terminal",
      },
      {
        id: "infra-database",
        title: "پایگاه داده",
        icon: Database,
        componentName: "Terminal",
      },
      {
        id: "infra-ci-cd",
        title: "CI/CD",
        icon: GitBranch,
        children: [
          {
            id: "cicd-pipelines",
            title: "خط لوله‌ها",
            icon: GitBranch,
            componentName: "Terminal",
          },
          {
            id: "cicd-deploys",
            title: "استقرارها",
            icon: Server,
            componentName: "Terminal",
          },
          {
            id: "cicd-logs",
            title: "لاگ‌ها",
            icon: FileText,
            componentName: "Terminal",
          },
        ],
      },
      {
        id: "infra-terminal",
        title: "ترمینال",
        icon: Terminal,
        componentName: "Terminal",
      },
    ],
  },

  // ── Contact (terminal) ──
  {
    id: "contact",
    title: "تماس با ما",
    icon: Phone,
    children: [
      {
        id: "contact-email",
        title: "ایمیل",
        icon: Mail,
        componentName: "Messages",
      },
      {
        id: "contact-phone",
        title: "تلفن",
        icon: Phone,
        componentName: "Messages",
      },
      {
        id: "contact-address",
        title: "آدرس",
        icon: Map,
        componentName: "Messages",
      },
    ],
  },
];

/**
 * Flatten the menu tree to a list of terminal nodes (items with componentName).
 * Used for search filtering.
 */
export function flattenTerminalItems(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  for (const item of items) {
    if (item.componentName) {
      result.push(item);
    }
    if (item.children) {
      result.push(...flattenTerminalItems(item.children));
    }
  }
  return result;
}
