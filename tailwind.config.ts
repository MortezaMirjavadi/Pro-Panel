/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        desktop: {
          bg: "#1a1b2e",
          surface: "#252641",
          border: "#363858",
          accent: "#6c5ce7",
          "accent-hover": "#7c6df7",
          taskbar: "#1e1f36",
          sidebar: "#20213a",
          text: "#e4e6f0",
          "text-muted": "#8b8da8",
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
