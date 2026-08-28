"use client";

import { useSyncExternalStore } from "react";

/**
 * The PS5 media bar carries a live clock. Small fidelity detail, and the
 * cheapest signal on the page that something is actually running.
 *
 * Time is an external source, so it is read with useSyncExternalStore rather
 * than mirrored into state from an effect. The server snapshot is null, which
 * renders nothing until hydration and so cannot produce a locale or
 * timezone mismatch between server and client.
 */
const format = () =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

let snapshot: string | null = null;

function subscribe(onStoreChange: () => void) {
  snapshot = format();
  onStoreChange();

  const id = window.setInterval(() => {
    const next = format();
    // Only notify when the displayed minute actually changes, so the store
    // stays stable and React does not re-render every tick.
    if (next !== snapshot) {
      snapshot = next;
      onStoreChange();
    }
  }, 10_000);

  return () => window.clearInterval(id);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => null;

export function Clock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!time) return null;

  return (
    <span className="hidden text-label tabular-nums text-ink-faint sm:inline">
      {time}
    </span>
  );
}
