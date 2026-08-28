"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { apps } from "@/content/apps";
import { cn } from "@/lib/cn";
import { TILE_ART } from "./tileArt";

/**
 * The home row, pinned to the top-left under the status bar.
 *
 * Three things make this read as a console rather than an app grid, all
 * taken from the reference shots:
 *
 *   1. The focused tile is genuinely BIGGER — the row reflows around it —
 *      rather than every tile being one size with a scale on top.
 *   2. Its label sits underneath it, in the gap below the row.
 *   3. Unfocused tiles stay at full brightness. Size and the outline carry
 *      the focus; dimming the rest is a web habit, not a console one.
 *
 * Width is the animated property here, which is normally worth avoiding.
 * It is deliberate: the reflow IS the effect, there are only five boxes, and
 * they sit in their own flex row so nothing else on the page relayouts.
 */
export function TileRow({
  focused,
  onFocus,
  onOpen,
  tabRefs,
}: {
  focused: number;
  onFocus: (index: number) => void;
  onOpen: (index: number) => void;
  tabRefs: React.RefObject<Array<HTMLButtonElement | null>>;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const tile = tabRefs.current?.[focused];
    if (!viewport || !tile) return;

    const overflow = viewport.scrollWidth - viewport.clientWidth;
    if (overflow <= 0) return;

    // Keep the focused tile toward the left, as the reference does, rather
    // than centring it.
    const target = Math.max(
      0,
      Math.min(tile.offsetLeft - viewport.clientWidth * 0.06, overflow),
    );
    if (Math.abs(viewport.scrollLeft - target) < 2) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  }, [focused, tabRefs]);

  return (
    <div
      ref={viewportRef}
      // shrink-0: as a flex item this was collapsing below its content on
      // short screens, which is what let the title block ride up into it.
      className="shrink-0 overflow-x-auto overflow-y-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* pb leaves the room the focused tile's label drops into. */}
      <ul
        role="tablist"
        aria-label="Sections"
        aria-orientation="horizontal"
        className="flex w-max items-start gap-2.5 px-[var(--gutter)] pt-1 pb-[var(--tile-row-pb)] sm:gap-3"
      >
        {apps.map((app, i) => {
          const isFocused = i === focused;
          const Art = TILE_ART[app.id];
          return (
            <li key={app.id} className="relative shrink-0">
              <button
                ref={(node) => {
                  if (tabRefs.current) tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`tile-${app.id}`}
                aria-selected={isFocused}
                aria-describedby="app-blurb"
                tabIndex={isFocused ? 0 : -1}
                onMouseEnter={() => onFocus(i)}
                onFocus={() => onFocus(i)}
                onClick={(event) => {
                  event.currentTarget.focus();
                  if (isFocused) onOpen(i);
                  else onFocus(i);
                }}
                className={cn(
                  "tile group relative block rounded-[14%] focus-visible:outline-none",
                  isFocused ? "tile--on" : "",
                )}
                // Size lives in CSS (--tile-on / --tile-off) so a height
                // media query can shrink the row. --tile-hue used to be set
                // here and read nowhere.
                // --i is the tile's place in the row; the return
                // choreography uses it to stagger the row left to right.
                style={{ "--art-hue": app.art, "--i": i } as CSSProperties}
              >
                {/* Face and lighting are entirely in CSS now — one
                    gradient, one lit edge, one shade. The inline stack of
                    radial gradients this replaced is what made the
                    highlights look scattered. */}
                <span
                  aria-hidden="true"
                  className="tile__face absolute inset-0 overflow-hidden rounded-[inherit]"
                >
                  <Art className="tile__art absolute inset-[11%] size-[78%]" />
                </span>

                <span className="sr-only">{app.label}</span>
              </button>

              {/* Always rendered, never mounted on demand. Conditional
                  rendering gave the label an entrance and no exit: the one
                  you moved away from was deleted mid-frame while the tile it
                  belonged to was still dimming. Absolutely positioned, so the
                  four invisible ones cost no layout. */}
              <span
                aria-hidden="true"
                data-on={isFocused || undefined}
                className="tile-label absolute top-full left-0 mt-3 whitespace-nowrap text-small font-medium text-ink"
              >
                {app.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
