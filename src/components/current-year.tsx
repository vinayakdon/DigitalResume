"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Rendered on the client so the year stays current without rebuilding. */
export function CurrentYear({ fallback = 2026 }: { fallback?: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <span>{year}</span>;
}
