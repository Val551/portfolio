import { skills } from "@/content/skills";
import { SkillMark, hasSkillMark } from "@/components/ui/brandMarks";

/**
 * Grouped rather than a flat wall of fifteen equal tiles: a flat list implies
 * a recruiter should weigh Rust and HTML/CSS equally.
 *
 * Each chip carries its technology's own mark. The marks are the vendors'
 * official geometry, not two-letter monograms, and the five entries that are
 * concepts rather than products (REST, sockets, pthreads) get a drawn glyph
 * at neutral chroma instead of an invented logo — see brandMarks.tsx.
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
                className={hasSkillMark(item) ? "chip chip--marked" : "chip"}
              >
                <SkillMark name={item} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
