/**
 * Event Bus
 * Simple pub/sub system using CustomEvents for component communication
 */

export const DASHBOARD_REFRESH_EVENT = 'dashboard:refresh';

export function emitDashboardRefresh(detail?: unknown): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DASHBOARD_REFRESH_EVENT, { detail }));
  }
}

export function subscribeToDashboardRefresh(handler: (detail?: unknown) => void): () => void {
  if (typeof window !== 'undefined') {
    const listener = (event: Event) => {
      const custom = event as CustomEvent;
      handler(custom?.detail);
    };
    window.addEventListener(DASHBOARD_REFRESH_EVENT, listener as EventListener);
    return () => window.removeEventListener(DASHBOARD_REFRESH_EVENT, listener as EventListener);
  }
  return () => {};
}
