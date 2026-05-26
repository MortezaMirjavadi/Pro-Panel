import mitt from "mitt";

/**
 * Strongly typed application-wide event bus.
 * Enables inter-window communication across isolated floating windows.
 *
 * Usage:
 *   import { eventBus, type AppEvents } from "./eventBus";
 *   eventBus.emit("REFRESH_DATA", { target: "users" });
 *   eventBus.on("REFRESH_DATA", (payload) => { ... });
 */
export type AppEvents = {
  /** Ask a specific window/app to refresh its data */
  REFRESH_DATA: { target: string };
  /** Show a notification message (routed to toast) */
  NOTIFY: { message: string; type?: "info" | "success" | "warning" | "error" };
  /** Generic data sync between windows */
  DATA_SYNC: { source: string; key: string; value: unknown };
};

export const eventBus = mitt<AppEvents>();
