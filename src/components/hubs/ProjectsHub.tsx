"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { projects } from "@/content/projects";
import { ProjectViewer } from "./ProjectViewer";
import { ArrowOutIcon, ChevronIcon } from "@/components/ui/icons";
import { TILE_ART } from "@/components/console/tileArt";

/**
 * Two levels, the way a console handles a game and its media: a library of
 * cover art, and — once you open one — its detail with the captures.
 *
 * The library used to be stacked prose rectangles, which was the one surface
 * on this site that did not speak the console's language: no colour, no art,
 * a full paragraph per row, and 42% of the screen empty beside it.
 */
export function ProjectsHub() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId) ?? null;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnTo = useRef<string | null>(null);

  const close = useCallback(() => {
    setOpenId(null);
  }, []);

  // Escape backs out one level, to the library. Registered on window in the
  // CAPTURE phase so it runs before the shell's own Escape handler, which
  // would otherwise close the entire hub. The previous version listened on a
  // wrapper div and so depended on focus being inside it: click any empty
  // space first and Escape skipped a level.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      event.preventDefault();
      event.stopPropagation();
      close();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  // Focus the detail heading on open; hand focus back to the row that opened
  // it on close, so keyboard position is never lost between levels.
  useEffect(() => {
    if (open) headingRef.current?.focus();
    else if (returnTo.current) {
      document.getElementById(returnTo.current)?.focus();
      returnTo.current = null;
    }
  }, [open]);

  if (open) {
    return (
      <div className="max-w-[52rem]">
        <button
          type="button"
          onClick={close}
          className="group inline-flex items-center gap-1.5 text-label text-ink-faint transition-colors hover:text-ink"
        >
          <ChevronIcon className="size-4 rotate-180" />
          All projects
        </button>

        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-h3 outline-none"
        >
          {open.title}
        </h3>

        <p className="measure mt-2 text-body text-ink-muted">{open.summary}</p>


        {open.stack.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {open.stack.map((tech) => (
              <li
                key={tech}
                className="chip"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        {open.shots.length > 0 ? <ProjectViewer project={open} /> : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {open.repo ? (
            <a
              href={open.repo}
              target="_blank"
              rel="noreferrer"
              className="hub__link inline-flex items-center gap-1 text-small"
            >
              GitHub <ArrowOutIcon className="size-4" />
            </a>
          ) : null}
          {open.demo ? (
            <a
              href={open.demo}
              target="_blank"
              rel="noreferrer"
              className="hub__link inline-flex items-center gap-1 text-small"
            >
              Live <ArrowOutIcon className="size-4" />
            </a>
          ) : null}
          {open.access ? (
            <p className="measure text-label text-ink-faint">{open.access}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <ul className="grid max-w-[64rem] grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4">
      {projects.map((project) => {
        // Cover art is the project's own first capture. Where there is none —
        // the proxy has no UI to capture — its instrument mark stands in, so
        // the three cards are never three copies of one shape.
        const cover = project.shots[0];
        const Mark = TILE_ART[project.id] ?? TILE_ART.projects;
        return (
          <li key={project.id}>
            <button
              type="button"
              id={`project-row-${project.id}`}
              onClick={() => {
                returnTo.current = `project-row-${project.id}`;
                setOpenId(project.id);
              }}
              style={
                {
                  "--art-hue": project.hue,
                  "--cover-zoom": project.coverZoom ?? 1,
                  "--cover-origin": project.coverOrigin ?? "top",
                } as CSSProperties
              }
              className="project-card group flex h-full w-full flex-col overflow-hidden rounded-md text-left"
            >
              <span className="project-card__cover relative block aspect-16/10 w-full overflow-hidden">
                {cover ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cover.src}
                    alt=""
                    width={cover.w}
                    height={cover.h}
                    /* Not lazy: the cover IS the card. Lazy images that
                       sit inside a conditionally-mounted panel routinely
                       never fetch, leaving the library blank. 77KB total,
                       and only once this hub opens. */
                    decoding="async"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="grid size-full place-items-center">
                    <Mark className="project-card__mark size-[42%]" />
                  </span>
                )}
              </span>

              <span className="flex flex-1 flex-col gap-2 p-4">
                <span className="text-body font-medium text-ink">
                  {project.title}
                </span>
                <span className="text-small text-ink-muted">{project.blurb}</span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {project.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="chip chip--compact"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 ? (
                    <span className="px-1 py-0.5 text-label text-ink-faint">
                      +{project.stack.length - 3}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
