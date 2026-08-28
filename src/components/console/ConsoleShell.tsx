"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { apps } from "@/content/apps";
import { useAmbient } from "@/hooks/useAmbient";
import { StatusBar } from "./StatusBar";
import { TileRow } from "./TileRow";
import { HintBar } from "./HintBar";
import { SectionView } from "./SectionView";
import { TILE_ART } from "./tileArt";

/**
 * The whole site: a console home screen.
 *
 * There is no scrolling page and no nav bar. The row of app tiles IS the
 * navigation — focus one to preview it, open it to read it. That is the
 * actual PlayStation interaction model, and it makes the keyboard the
 * primary input rather than an accessibility afterthought.
 */
export function ConsoleShell() {
  const [focused, setFocused] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const { setAmbient, setRecessed } = useAmbient();

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const moveByKeyboard = useRef(false);

  const app = apps[focused];
  const openApp = openId ? (apps.find((a) => a.id === openId) ?? null) : null;
  const HeroArt = TILE_ART[app.id];


  // The focused tile paints the whole screen, exactly as a console derives
  // its background from whatever is highlighted. `pan` is the tile's
  // position in the row, so the room's parallax is a function of where the
  // selection IS rather than of an animation having run.
  useEffect(() => {
    setAmbient({
      hue: app.hue,
      pan: apps.length > 1 ? focused / (apps.length - 1) : 0,
      mark: app.id,
    });
  }, [app.hue, app.id, focused, setAmbient]);

  // Opening a hub drops the room back behind the content.
  useEffect(() => {
    setRecessed(Boolean(openApp));
  }, [openApp, setRecessed]);

  const focus = useCallback((index: number) => {
    setFocused(((index % apps.length) + apps.length) % apps.length);
  }, []);

  const open = useCallback((index: number) => setOpenId(apps[index].id), []);

  const restoreFocus = useRef(false);

  // Coming back is its own moment, not the absence of one. Bumping this key
  // replays the home screen's entrance; `returning` drives the row's stagger
  // for as long as it runs. Without either, closing a hub cross-faded a
  // static screenshot back in: nothing moved, nothing re-lit.
  const [returnKey, setReturnKey] = useState(0);
  const [returning, setReturning] = useState(false);

  const close = useCallback(() => {
    setOpenId(null);
    restoreFocus.current = true;
    setReturnKey((k) => k + 1);
    setReturning(true);
  }, []);

  // Cleared on a timer rather than animationend: five staggered animations
  // run, and which one finishes last is not something any single element
  // knows.
  useEffect(() => {
    if (!returning) return;
    const timer = window.setTimeout(() => setReturning(false), 760);
    return () => window.clearTimeout(timer);
  }, [returning]);

  // Return focus to the tile the reader came from, once the home screen is
  // back in the DOM. Done in an effect rather than requestAnimationFrame:
  // rAF is throttled in background tabs and headless renderers, which would
  // strand focus on a removed element.
  useEffect(() => {
    if (openId || !restoreFocus.current) return;
    restoreFocus.current = false;
    tabRefs.current[focused]?.focus();
  }, [openId, focused]);

  // Keyboard is the primary input, so it is handled at the shell rather than
  // per-component. Typing in a field is never hijacked.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // The target is not always an Element (it can be window or document),
      // and calling closest() on those throws and kills the whole handler.
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;

      if (openId) {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          moveByKeyboard.current = true;
          focus(focused + 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          moveByKeyboard.current = true;
          focus(focused - 1);
          break;
        case "Home":
          event.preventDefault();
          moveByKeyboard.current = true;
          focus(0);
          break;
        case "End":
          event.preventDefault();
          moveByKeyboard.current = true;
          focus(apps.length - 1);
          break;
        case "Enter":
        case " ":
          if (target?.closest("[role='tab']")) return; // the button handles it
          event.preventDefault();
          open(focused);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, focus, focused, open, openId]);

  // Move DOM focus with the roving index, but only for keyboard moves —
  // otherwise hovering would yank focus away from the reader.
  useEffect(() => {
    if (!moveByKeyboard.current) return;
    moveByKeyboard.current = false;
    tabRefs.current[focused]?.focus();
  }, [focused]);

  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden">
      <StatusBar />

      <div className="relative min-h-0 flex-1">
        {/* Home screen. Kept mounted under the hub so returning is instant
            and the row never has to re-measure. */}
        <div
          // `inert`, not `aria-hidden`. aria-hidden alone left the five tiles
          // and the Open button focusable inside a subtree that claimed to be
          // hidden, so Tab landed on invisible controls and screen readers hit
          // the aria-hidden-focus violation. `inert` removes the subtree from
          // the tab order, the a11y tree and hit testing in one attribute,
          // which is also what makes the hub's aria-modal claim honest.
          inert={openApp ? true : undefined}
          data-returning={returning || undefined}
          // Expo, like every other curve in this project. Tailwind's default
          // `ease` was front-loaded here: 89% of the fade landed in the first
          // 150ms of a 320ms transition, which is what made coming back read
          // as a snap rather than a settle.
          className={
            openApp
              ? "absolute inset-0 opacity-0 transition-opacity duration-[var(--d-ui)] ease-[var(--ease-out-expo)]"
              : "absolute inset-0 flex flex-col opacity-100 transition-opacity duration-[var(--d-ui)] ease-[var(--ease-out-expo)]"
          }
        >
          {/* Key art. The console fills this space with the focused game's
              artwork; here the focused section's own mark is blown up and
              held at low opacity on the right, so the middle of the screen
              belongs to the selection instead of sitting empty. Decorative,
              and clear of the lower-left column where the type lives. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-[-6%] hidden w-[62%] items-center justify-center md:flex"
          >
            <HeroArt
              key={`${app.id}-hero-${returnKey}`}
              className="hero-art h-[62vh] w-auto"
              style={{ "--art-hue": app.art } as CSSProperties}
            />
          </div>

          {/* The row sits at the top under the status bar, left-aligned, the
              way a console home screen is laid out — not centred in the
              middle of the screen like an app launcher. */}
          <TileRow
            focused={focused}
            onFocus={focus}
            onOpen={open}
            tabRefs={tabRefs}
          />

          {/* And the title block sits low and left, over the room, with one
              primary action — the console's "Play Game" slot. */}
          <div className="mt-auto px-[var(--gutter)] pb-[clamp(1rem,4vh,2.5rem)]">
            <h1 key={`${app.id}-${returnKey}`} className="hub-title text-h1">
              {app.label}
            </h1>
            {/* Always rendered, even for the one app with no blurb: every
                tile points `aria-describedby` here, and mounting the element
                conditionally left those five references dangling at exactly
                the moment Projects was focused.

                Not a live region. The blurb only ever changes because the
                reader moved the selection themselves, and hover moves it, so
                sweeping the pointer across the row queued five "polite"
                announcements in about a second. As a description it is read
                once, when the tile it belongs to takes focus. */}
            <p
              key={`${app.id}-blurb-${returnKey}`}
              id="app-blurb"
              className={`hub-title max-w-[46ch] text-small text-ink-muted${
                app.blurb ? " mt-3" : ""
              }`}
            >
              {app.blurb}
            </p>

            <div
              key={`${app.id}-action-${returnKey}`}
              className="hub-title mt-6 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={() => open(focused)}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-7 text-small font-semibold text-void transition-transform duration-200 ease-[var(--ease-out-expo)] hover:scale-[1.03] active:scale-[0.99]"
              >
                Open
              </button>
              <span className="text-label tabular-nums text-ink-faint">
                {app.meta}
              </span>
            </div>
          </div>
        </div>

        {openApp ? <SectionView app={openApp} onClose={close} /> : null}
      </div>

      <HintBar open={Boolean(openApp)} />
    </div>
  );
}
