"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";

/**
 * Power-on. A console's boot is a light coming up on a mark, not a logo
 * sliding in — so the initials are struck once by a sweep of the key light
 * and then hold.
 *
 * Entirely CSS: a JS-driven boot would stall wherever the animation clock is
 * throttled and strand the visitor on a black screen. The advance to the
 * lock screen is a plain timer, which is not clock-dependent.
 */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  useEffect(() => {
    // Anyone who asked for reduced motion gets a beat rather than the full
    // sequence: the CSS already collapses the animation, so holding here
    // would just be a static screen they did not ask for.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(onDone, reduced ? 260 : 2100);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <div className="boot-screen grid h-[100svh] place-items-center bg-void">
      <p className="boot-mark text-[clamp(3.5rem,13vw,7rem)] leading-none font-semibold tracking-[-0.03em] text-ink">
        {initials}
        <span className="sr-only">. {profile.name}. Starting up.</span>
      </p>
    </div>
  );
}
