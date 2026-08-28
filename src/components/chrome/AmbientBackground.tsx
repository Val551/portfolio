"use client";

import { useEffect } from "react";
import { useAmbient } from "@/hooks/useAmbient";
import type { CSSProperties } from "react";

/**
 * The PS5's defining move: an enormous soft field of colour behind
 * everything, derived from whatever is currently focused.
 *
 * Four things respond to the selection, and they are one idea rather than
 * four effects. The room is a place; moving along the row walks a light
 * through it.
 *
 *   PAN     layers slide laterally as focus travels the row, nearer ones
 *           further than far ones, so the room has depth rather than being
 *           a flat picture that changes colour.
 *   BLOOM   light swells once behind the key art as the selection lands.
 *   TINT    the hue crossfades on an expo curve rather than linearly.
 *   RECEDE  opening a hub drops the whole room back behind the content.
 *
 * Rendered once at the root. Purely decorative, so hidden from AT.
 */
export function AmbientBackground() {
  const { hue, pan, mark, recessed } = useAmbient();

  // Six layers loop forever, the longest over 104s. Backgrounded, that is
  // pure battery cost, and a portfolio link spends most of its life in a tab
  // nobody is looking at. Paused rather than unmounted: every layer still
  // paints, so returning to the tab shows the same room, not a reflow.
  useEffect(() => {
    const sync = () => {
      document.documentElement.toggleAttribute("data-idle", document.hidden);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      document.documentElement.removeAttribute("data-idle");
    };
  }, []);

  return (
    <div
      className="ambient"
      aria-hidden="true"
      data-recessed={recessed || undefined}
      style={{ "--ambient-hue": hue, "--ambient-pan": pan } as CSSProperties}
    >
      <div className="ambient__field" />
      <div className="ambient__blobs">
        <div className="ambient__blob ambient__blob--a" />
        <div className="ambient__blob ambient__blob--b" />
        <div className="ambient__blob ambient__blob--c" />
      </div>
      {/* Keyed so React remounts it and the animation replays. The same
          swap-not-transition technique the hub title uses: an effect that
          must fire on every change, from an element whose resting state is
          invisible either way. */}
      <div key={mark} className="ambient__bloom" />
      <div className="ambient__bokeh ambient__bokeh--far" />
      <div className="ambient__bokeh" />
      <div className="ambient__scrim" />
      <div className="ambient__grain" />
    </div>
  );
}
