"use client";

import { useEffect, useState } from "react";

/**
 * True once the visitor has not touched the page for `delay` milliseconds.
 *
 * Deliberately knows nothing about where it is used. An earlier version took
 * an `enabled` flag and reset itself when that flipped, which meant calling
 * setState in the effect body and cascading renders; the caller gating the
 * result is both simpler and correct. Every path that closes a hub involves
 * an input event, so idleness accrued while reading is always cleared before
 * it could show anything.
 */
export function useIdle(delay: number): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), delay);

    const wake = () => {
      // Functional update returning the SAME value when already awake, so a
      // mousemove does not re-render the console sixty times a second.
      setIdle((was) => (was ? false : was));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), delay);
    };

    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
      "focusin",
    ] as const;
    for (const event of events) {
      window.addEventListener(event, wake, { passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, wake);
    };
  }, [delay]);

  return idle;
}
