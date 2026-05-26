import { useEffect, useCallback } from "react";
import { eventBus, type AppEvents } from "./eventBus";
import type { Handler } from "mitt";

/**
 * Hook to subscribe to typed events on the global event bus.
 * Automatically unsubscribes on unmount.
 *
 * @param event - The event name to listen for
 * @param handler - Callback invoked when the event fires
 *
 * @example
 * useEventBus("REFRESH_DATA", (payload) => {
 *   if (payload.target === "users") refetch();
 * });
 */
export function useEventBus<K extends keyof AppEvents>(
  event: K,
  handler: Handler<AppEvents[K]>
) {
  useEffect(() => {
    eventBus.on(event, handler);
    return () => {
      eventBus.off(event, handler);
    };
  }, [event, handler]);
}

/**
 * Hook that returns a stable `emit` function for the given event.
 *
 * @example
 * const emitRefresh = useEmit("REFRESH_DATA");
 * emitRefresh({ target: "users" });
 */
export function useEmit<K extends keyof AppEvents>(event: K) {
  return useCallback(
    (payload: AppEvents[K]) => {
      eventBus.emit(event, payload);
    },
    [event]
  );
}
