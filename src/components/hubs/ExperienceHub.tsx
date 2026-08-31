import { experience } from "@/content/experience";
import { OrgMark } from "@/components/ui/brandMarks";

/**
 * PS5 Activities, translated: a chronological feed on a spine, each entry
 * with an organisation, a role and a system-style timestamp.
 */
export function ExperienceHub() {
  return (
    // The spine is decorative, so it sits outside the list rather than
    // inside it as a sixth <li>: as a list item it made every screen
    // reader announce six roles where there are five.
    <div className="relative max-w-[58rem]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2 bottom-2 left-[7px] w-px bg-linear-to-b from-transparent via-[var(--hairline-strong)] to-transparent"
      />
      <ol>
        {experience.map((entry) => (
          <li key={entry.id} className="relative pb-8 pl-9 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-[0.55rem] left-0 grid size-[15px] place-items-center rounded-full border border-[var(--hairline-strong)] bg-chassis"
            >
              <span className="size-[5px] rounded-full bg-[oklch(var(--instrument-on-l)_var(--instrument-c)_var(--art-hue,220))]" />
            </span>

            <article className="rounded-md border border-[var(--hairline)] bg-panel p-5">
              {/* The logo hangs outside the text column and everything else
                  aligns to one left edge, so the five entries read as one
                  column with a gutter rather than five indented blocks. */}
              <div className="flex gap-4">
                <OrgMark organization={entry.organization} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-h3">{entry.organization}</h3>
                    {/* Not a <time>: the value is a range, and `datetime` has no
                        syntax for one, so the element carried no machine-readable
                        value it could not have carried as a span. */}
                    <span className="text-label tabular-nums text-ink-faint">
                      {entry.period}
                    </span>
                  </div>

                  <p className="mt-1 text-small text-ink-muted">{entry.role}</p>

                  <ul className="measure mt-4 grid gap-2">
                    {entry.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="relative pl-4 text-small text-ink-muted before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-ink-faint"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
