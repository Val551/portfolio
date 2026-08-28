"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * A walkable facsimile of a project that cannot be linked.
 *
 * Engineering OS lives behind Google/GitHub sign-in and in a private repo,
 * so the usual "here's the demo, here's the source" affordances are both
 * dead ends. Its seven captures happen to map one-to-one onto the app's own
 * navigation, so instead of a gallery this rebuilds that navigation: pick a
 * section and the capture swaps. A visitor gets the shape of the product
 * rather than a pile of images.
 *
 * The chrome is deliberately this site's own design language, not a copy of
 * the app's. It should read as the portfolio presenting the app — never as
 * something pretending to be the live product. The caption below says so
 * outright.
 */
export function ProjectViewer({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const viaKeyboard = useRef(false);
  const shots = project.shots;

  const select = useCallback(
    (next: number) => {
      setActive(((next % shots.length) + shots.length) % shots.length);
    },
    [shots.length],
  );

  // Move DOM focus with the roving index, but only for keyboard moves — the
  // same rule the home row follows, so the two behave identically.
  useEffect(() => {
    if (!viaKeyboard.current) return;
    viaKeyboard.current = false;
    tabRefs.current[active]?.focus();
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowUp: active - 1,
      Home: 0,
      End: shots.length - 1,
    };
    const next = map[event.key];
    if (next === undefined) return;
    event.preventDefault();
    event.stopPropagation(); // don't let the shell's arrow handler also fire
    viaKeyboard.current = true;
    select(next);
  };

  const shot = shots[active];

  return (
    <figure
      // Capped so the nav, the capture and its caption are all on screen
      // together — the whole point is switching sections and watching the
      // capture change, which does not work if you must scroll between them.
      className="project-viewer mt-6 max-w-[52rem] overflow-hidden rounded-md"
      style={{ "--art-hue": project.hue } as CSSProperties}
    >
      <div className={shots.length > 1 ? "grid sm:grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)]" : ""}>
        {/* The app's own navigation, rebuilt. */}
        {/* A single capture needs no switcher — a one-item tablist is noise. */}
        {shots.length > 1 ? (
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label={`${project.title} sections`}
          onKeyDown={onKeyDown}
          className="flex gap-1 overflow-x-auto border-b border-[var(--hairline)] p-2 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {shots.map((s, i) => (
            <button
              key={s.src}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`shot-${project.id}-${i}`}
              aria-selected={i === active}
              aria-controls={`shotpanel-${project.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "shrink-0 rounded-sm px-3 py-2 text-left text-label whitespace-nowrap transition-colors duration-200",
                i === active
                  ? "viewer-nav--on bg-[oklch(1_0_0_/_0.06)]"
                  : "text-ink-faint hover:text-ink-muted",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        ) : null}

        {/* All captures stay mounted and all load eagerly. `loading="lazy"`
            looks right here and is wrong: a browser will not fetch an
            image sitting at opacity 0, so the very captures the visitor is
            about to switch to are the ones that never arrive. 256KB total,
            fetched only when this hub opens, buys an instant swap. */}
        <div
          role="tabpanel"
          id={`shotpanel-${project.id}`}
          aria-labelledby={`shot-${project.id}-${active}`}
          // The pane takes the ACTIVE capture's own ratio. Hardcoding one
          // ratio letterboxes any project whose captures differ — these run
          // from 1.76 to 2.42.
          style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
          className="relative w-full bg-[oklch(0.1_0.004_var(--art-hue,220))]"
        >
          {shots.map((s, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={s.src}
              src={s.src}
              alt={`${project.title}, ${s.label}. ${s.caption}`}
              width={s.w}
              height={s.h}
              // The inactive captures stay loaded (see above) but must not
              // stay announced: six of them at opacity 0 put ~1,000 characters
              // of alt text into this one tabpanel.
              aria-hidden={i !== active ? true : undefined}
              decoding="async"
              className={cn(
                "viewer-shot absolute inset-0 size-full object-contain",
                i === active && "viewer-shot--on",
              )}
            />
          ))}
        </div>
      </div>

      <figcaption className="border-t border-[var(--hairline)] px-4 py-3">
        <p key={shot.src} className="viewer-caption measure text-small text-ink-muted">
          <span className="text-ink">{shot.label}.</span> {shot.caption}
        </p>
      </figcaption>
    </figure>
  );
}
