"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    neonCursor?: any;
    __neonCursorLoaded?: boolean;
  }
}

export default function ThreejsToysLoader() {
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (window.__neonCursorLoaded && window.neonCursor) {
          // Already loaded globally
          return;
        }
        //@ts-ignore
        const mod: any = await import("threejs-toys");
        if (cancelled) return;
        const neonFn = mod?.neonCursor || mod?.default?.neonCursor || mod?.default;
        if (typeof neonFn === "function") {
          window.neonCursor = neonFn;
          window.__neonCursorLoaded = true;
          window.dispatchEvent(new CustomEvent("neonCursorReady"));
        } else {
          // Expose no-op to unblock listeners if export shape unexpected
          window.neonCursor = undefined;
          window.__neonCursorLoaded = false;
        }
      } catch (err) {
        // Don't crash app if loading fails
        console.error("Failed to preload threejs-toys:", err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

