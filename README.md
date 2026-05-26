# Pro Panel — Web Desktop Admin Panel

A modern MDI (Multiple Document Interface) admin panel that simulates a desktop operating system experience in the browser. Instead of traditional page routing, every feature opens inside a floating, draggable, and resizable window.

![Pro Panel Screenshot](./demo.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 6 |
| UI Framework | React 19 + TypeScript |
| State Management | Zustand 5 |
| Window Drag/Resize | react-rnd |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Command Palette | cmdk |

## Features

### Window Management System

The core of the application — a full MDI window manager powered by Zustand and react-rnd.

- **Open** — windows open via the sidebar or command palette, with automatic cascade positioning so they don't stack on top of each other.
- **Close** — clicking the X button removes the window from state and auto-focuses the next visible window.
- **Minimize** — hides the window from the desktop while keeping it alive in the taskbar. Focus passes to the next top-most window.
- **Maximize / Restore** — double-clicking the title bar or clicking the maximize button expands the window to fill the entire desktop area. Clicking restore returns it to its previous position and size.
- **Focus (z-index stacking)** — clicking anywhere on a window brings it to the front by bumping its z-index. The active window gets a purple accent border and title bar.
- **Drag** — the title bar acts as the drag handle. Windows can be moved freely within the desktop bounds.
- **Resize** — all window edges and corners are resizable with a minimum size of 400x300px.
- **Duplicate prevention** — opening an already-open window focuses and un-minimizes it instead of creating a duplicate.

### Sidebar (RTL)

A collapsible right-side navigation panel (natural position for RTL layouts).

- Lists all available "applications" with Lucide icons.
- Clicking a menu item triggers `openWindow` — no route changes.
- Collapse toggle shrinks the sidebar to icon-only mode (64px).
- Built-in search trigger that opens the command palette.

### Taskbar

A Windows-style taskbar pinned to the bottom of the screen.

- Displays all currently open windows with their icon and title.
- Clicking a focused window minimizes it.
- Clicking a minimized window restores it.
- Clicking a background window brings it to focus.
- Minimized windows show a subtle opacity indicator.

### Command Palette (cmdk)

A Spotlight-like search overlay for rapid window switching.

- Activated globally via `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux).
- Closes on `Escape` or clicking the backdrop.
- Searches through all currently open windows by title and component name.
- Selecting a result restores the window (if minimized) and focuses it.
- Shows a "minimized" badge on windows that are hidden.

### RTL (Right-to-Left) Layout

The entire application is built RTL-first.

- `<html dir="rtl">` on the root element.
- Sidebar positioned on the right side.
- All text, tables, forms, and navigation flows right-to-left.
- Persian (Farsi) used throughout the UI labels and content.

### Component Registry & Lazy Loading

A clean mapping pattern for registering window content.

- `componentRegistry` maps string names to `React.lazy()` components.
- Window bodies are wrapped in `<Suspense>` with a loading spinner fallback.
- Adding a new window type requires only: (1) create the component, (2) add an entry to the registry, (3) add a definition to `windowDefinitions`.

### 8 Built-in Window Applications

Each window is a self-contained React component with realistic UI.

| Window | Description |
|---|---|
| **Dashboard** | Stats cards (users, sales, revenue, live visitors) + monthly sales bar chart |
| **Users** | Searchable user table with roles, status badges, and a "new user" button |
| **Settings** | Side-navigated settings panel with dark mode, notifications, and RTL toggles |
| **Analytics** | Metric cards with trend indicators + weekly traffic bar chart |
| **File Manager** | Folder grid with file counts + recent files list with sizes and dates |
| **Messages** | Split-pane chat UI with contact list, unread badges, and message bubbles |
| **Calendar** | Monthly calendar grid with Persian day names and color-coded events |
| **Terminal** | Interactive terminal emulator with command history (help, ls, pwd, whoami, date, echo, clear) |

### Theming & Styling

- Custom dark color palette defined in `tailwind.config.ts` under `colors.desktop.*`.
- Custom scrollbar styling for WebKit browsers.
- cmdk overrides styled to match the desktop theme.
- Subtle dot-grid background pattern on the desktop area.
- Smooth transitions on window focus, sidebar collapse, and interactive elements.

## Project Structure

```
pro-panel/
├── index.html                     # RTL HTML shell
├── package.json
├── vite.config.ts                 # Vite + path aliases
├── tailwind.config.ts             # Custom desktop color palette
├── postcss.config.js
├── tsconfig.json
└── src/
    ├── main.tsx                   # React entry point
    ├── App.tsx                    # Root layout (sidebar + desktop + taskbar + palette)
    ├── vite-env.d.ts
    ├── styles/
    │   └── globals.css            # Tailwind directives + cmdk/scrollbar styles
    ├── store/
    │   ├── types.ts               # WindowType, OpenWindowParams interfaces
    │   ├── useWindowStore.ts      # Zustand store with all window actions
    │   └── index.ts               # Barrel export
    ├── components/
    │   ├── registry.ts            # Component registry + window definitions
    │   ├── DynamicWindow.tsx      # react-rnd wrapper (drag, resize, focus, controls)
    │   ├── Sidebar.tsx            # Collapsible RTL navigation sidebar
    │   ├── Taskbar.tsx            # Bottom taskbar for open windows
    │   └── CommandPalette.tsx     # cmdk-based Cmd+K search overlay
    └── windows/
        ├── Dashboard.tsx
        ├── Users.tsx
        ├── Settings.tsx
        ├── Analytics.tsx
        ├── FileManager.tsx
        ├── Messages.tsx
        ├── Calendar.tsx
        └── Terminal.tsx
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## How to Add a New Window

1. Create a new component in `src/windows/YourApp.tsx`:

```tsx
export default function YourApp() {
  return <div dir="rtl">Your content here</div>;
}
```

2. Register it in `src/components/registry.ts`:

```ts
// Add to componentRegistry
YourApp: lazy(() => import("../windows/YourApp")),

// Add to windowDefinitions
{ id: "your-app", title: "عنوان", componentName: "YourApp", icon: "IconName" },
```

That's it — the sidebar, taskbar, and command palette will automatically pick it up.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Escape` | Close command palette |

## License

MIT
