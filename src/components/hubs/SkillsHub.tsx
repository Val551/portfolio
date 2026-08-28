import { skills } from "@/content/skills";

/**
 * Grouped rather than a flat wall of fifteen equal tiles: a flat list implies
 * a recruiter should weigh Rust and HTML/CSS equally.
 *
 * Deliberately text chips rather than icons: there is no icon source for
 * these technologies, and two-letter monograms would read as filler.
 */
export function SkillsHub() {
  return (
    <div className="grid max-w-[58rem] gap-7">
      {skills.map((group) => (
        <div
          key={group.label}
          className="grid gap-x-8 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline"
        >
          <h3 className="text-label text-ink-faint">{group.label}</h3>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="chip"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
