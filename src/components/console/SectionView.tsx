"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { App } from "@/content/apps";
import { CloseIcon } from "@/components/ui/icons";
import { ExperienceHub } from "@/components/hubs/ExperienceHub";
import { ProjectsHub } from "@/components/hubs/ProjectsHub";
import { SkillsHub } from "@/components/hubs/SkillsHub";
import { AboutHub } from "@/components/hubs/AboutHub";
import { ContactHub } from "@/components/hubs/ContactHub";

const HUBS: Record<string, () => React.ReactElement> = {
  experience: ExperienceHub,
  projects: ProjectsHub,
  skills: SkillsHub,
  about: AboutHub,
  contact: ContactHub,
};

/**
 * The game hub: what you get after opening a tile. It covers the home screen
 * rather than navigating away, so the console never leaves the shell.
 *
 * Focus moves here on open and returns to the originating tile on close,
 * which ConsoleShell handles.
 */
export function SectionView({
  app,
  onClose,
}: {
  app: App;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const Hub = HUBS[app.id];

  // Move focus to the hub's heading so keyboard and screen-reader users land
  // where the new content starts rather than back at the top of the document.
  useEffect(() => {
    headingRef.current?.focus();
    // A newly opened hub starts at the top, so clear any stale scrolled flag.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollRef.current.dataset.scrolled = "false";
    }
  }, [app.id]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hub-heading"
      className="hub absolute inset-0 z-[var(--z-content)] flex flex-col"
      style={{ "--art-hue": app.art } as CSSProperties}
    >
      <div className="flex items-start justify-between gap-6 px-[var(--gutter)] pt-4 pb-5 sm:pt-6">
        <div className="min-w-0">
          <h2
            id="hub-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-h1 outline-none"
          >
            {app.label}
          </h2>
          {app.blurb ? (
            <p className="mt-1.5 max-w-[58ch] text-small text-ink-muted">
              {app.blurb}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--hairline-strong)] text-ink-muted transition-colors duration-200 hover:text-ink"
        >
          <CloseIcon className="size-[18px]" />
          <span className="sr-only">Close {app.label} and return to the menu</span>
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={(event) => {
          const el = event.currentTarget;
          el.dataset.scrolled = el.scrollTop > 4 ? "true" : "false";
        }} className="hub__scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-[var(--gutter)] pb-16">
        {Hub ? <Hub /> : null}
      </div>
    </div>
  );
}
