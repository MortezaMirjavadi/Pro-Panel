/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        desktop: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          border: "var(--color-border)",
          accent: "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          taskbar: "var(--color-taskbar)",
          sidebar: "var(--color-sidebar)",
          text: "var(--color-text)",
          "text-muted": "var(--color-text-muted)",
          danger: "#e74c3c",
          success: "#2ecc71",
          warning: "#f39c12",
        },
      },
      zIndex: {
        window: "10",
        "window-active": "100",
        taskbar: "1000",
        sidebar: "1000",
        palette: "2000",
      },
    },
  },
  plugins: [],
};
