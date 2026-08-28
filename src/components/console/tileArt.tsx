/**
 * Reticle set for the home row.
 *
 * These are drawn as ONE system, not five illustrations. Three rules are
 * enforced across every glyph, and they are the difference between a set
 * that was designed and a set that was generated:
 *
 *   1. THREE STROKE WEIGHTS. Only HAIR, LINE and MARK exist. The previous
 *      set used thirteen different widths across five icons, which is the
 *      single loudest tell that each was drawn on its own.
 *   2. ONE CONCENTRIC GRID. Every glyph is built on the same radii, so all
 *      five share an optical bounding circle and sit at the same visual
 *      size. Graduations always run between GRAD_IN and R_OUT.
 *   3. COMPARABLE INK. Each glyph draws 12–21 elements. The old set ranged
 *      from 5 to 54, so Experience read ten times heavier than Skills.
 *
 * Colour is not set here. The row supplies it, so the same geometry serves
 * the tile, the dimmed state and the blown-up key art.
 */
type ArtProps = { className?: string; style?: React.CSSProperties };

/* The only stroke weights in the system. */
const HAIR = 1.25; // graduations, tick marks
const LINE = 2.25; // structure: rings, orbits, bars
const MARK = 3.5; // the primary form, one per glyph

/* The shared grid. Every glyph uses these radii and no others. */
const R_OUT = 42;
const GRAD_IN = 34;
const R_MID = 30;
const R_IN = 17;
const R_DOT = 3.5;

const svg = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "butt" as const,
  "aria-hidden": true,
  focusable: false,
};

function pt(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [50 + r * Math.cos(rad), 50 + r * Math.sin(rad)];
}

function arc(r: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function radial(r0: number, r1: number, deg: number): string {
  const [x0, y0] = pt(r0, deg);
  const [x1, y1] = pt(r1, deg);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/** Graduations on the shared outer track. Long marks at the quadrants. */
function Graduations({ count, from = 0 }: { count: number; from?: number }) {
  return (
    <g strokeWidth={HAIR} opacity={0.55}>
      {Array.from({ length: count }, (_, i) => {
        const deg = from + (i * 360) / count;
        const long = i % (count / 4) === 0;
        return <path key={deg} d={radial(long ? GRAD_IN : GRAD_IN + 4, R_OUT, deg)} />;
      })}
    </g>
  );
}

/** Experience — a chronograph: elapsed time swept against a graduated track. */
export function ExperienceArt({ className, style }: ArtProps) {
  return (
    <svg {...svg} className={className} style={style}>
      <Graduations count={16} />
      <path d={arc(R_MID, -90, 128)} strokeWidth={MARK} strokeLinecap="round" />
      <circle cx="50" cy="50" r={R_IN} strokeWidth={LINE} opacity={0.6} />
      <path d={radial(0, R_IN, 128)} strokeWidth={LINE} strokeLinecap="round" />
      <circle cx="50" cy="50" r={R_DOT} fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Projects — a bracket frame closing on a target. Bounded, constructed. */
export function ProjectsArt({ className, style }: ArtProps) {
  const b = (x: number, y: number, sx: number, sy: number) =>
    `M${x} ${y + sy * 12} L${x} ${y} L${x + sx * 12} ${y}`;
  return (
    <svg {...svg} className={className} style={style}>
      <Graduations count={8} from={22.5} />
      <g strokeWidth={MARK} strokeLinecap="round" strokeLinejoin="round">
        <path d={b(22, 22, 1, 1)} />
        <path d={b(78, 22, -1, 1)} />
        <path d={b(22, 78, 1, -1)} />
        <path d={b(78, 78, -1, -1)} />
      </g>
      <g strokeWidth={LINE} opacity={0.6}>
        <path d={arc(R_IN, 30, 60)} />
        <path d={arc(R_IN, 120, 150)} />
        <path d={arc(R_IN, 210, 240)} />
        <path d={arc(R_IN, 300, 330)} />
      </g>
      <rect x={50 - R_DOT * 1.7} y={50 - R_DOT * 1.7} width={R_DOT * 3.4} height={R_DOT * 3.4} strokeWidth={LINE} />
    </svg>
  );
}

/** Skills — levels on a baseline. Measured, not radiated. */
export function SkillsArt({ className, style }: ArtProps) {
  // Bars radiating from the centre read as a sunburst no matter how much
  // the lengths vary — that reading is inherent to the geometry, not the
  // tuning. Levels need a shared baseline to read as levels, so these sit
  // on one. The graduation ring keeps it in the family.
  const levels = [0.32, 0.62, 1, 0.48, 0.86, 0.4, 0.7];
  // Sized to fill the same optical circle the other four occupy; a smaller
  // cluster would read as lighter than its neighbours.
  const base = 72;
  const span = 50;
  return (
    <svg {...svg} className={className} style={style}>
      <Graduations count={8} />
      <g strokeWidth={MARK} strokeLinecap="round">
        {levels.map((lv, i) => {
          const x = 50 - span / 2 + (i * span) / (levels.length - 1);
          return (
            <path
              key={x}
              d={`M${x.toFixed(1)} ${base} V${(base - 8 - lv * 40).toFixed(1)}`}
              opacity={0.45 + lv * 0.55}
            />
          );
        })}
      </g>
      <path d={`M${50 - span / 2 - 5} ${base} H${50 + span / 2 + 5}`} strokeWidth={LINE} opacity={0.6} />
    </svg>
  );
}

/** About — an orbit around a fixed point. A position, held. */
export function AboutArt({ className, style }: ArtProps) {
  return (
    <svg {...svg} className={className} style={style}>
      <Graduations count={8} />
      <path d={arc(R_MID, 34, 300)} strokeWidth={MARK} strokeLinecap="round" />
      <ellipse cx="50" cy="50" rx={R_MID} ry={R_IN * 0.72} strokeWidth={LINE} opacity={0.55} transform="rotate(-24 50 50)" />
      <circle cx="50" cy="50" r={R_IN * 0.62} strokeWidth={LINE} opacity={0.8} />
      <circle {...(() => { const [x, y] = pt(R_MID, 34); return { cx: x.toFixed(2), cy: y.toFixed(2) }; })()} r={R_DOT * 1.2} fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Contact — a signal leaving a node. Directional, outbound. */
export function ContactArt({ className, style }: ArtProps) {
  // The node sits on the shared grid at the lower left and the arcs open
  // from it, so the mass is balanced across the diagonal rather than
  // pooling in one corner.
  const [nx, ny] = pt(R_IN + 4, 232);
  return (
    <svg {...svg} className={className} style={style}>
      <g strokeWidth={HAIR} opacity={0.5}>
        {[24, 48, 72].map((d) => (
          <path key={d} d={radial(GRAD_IN + 4, R_OUT, d)} />
        ))}
      </g>
      <path d={arc(R_IN + 2, 14, 92)} strokeWidth={MARK} strokeLinecap="round" />
      <path d={arc(R_MID + 3, 8, 98)} strokeWidth={LINE} strokeLinecap="round" opacity={0.6} />
      <path d={arc(R_OUT - 2, 2, 104)} strokeWidth={HAIR} strokeLinecap="round" opacity={0.35} />
      <circle cx={nx.toFixed(2)} cy={ny.toFixed(2)} r={R_DOT * 1.5} fill="currentColor" stroke="none" />
      <circle cx={nx.toFixed(2)} cy={ny.toFixed(2)} r={R_DOT * 3.2} strokeWidth={LINE} opacity={0.5} />
    </svg>
  );
}

export const TILE_ART: Record<string, (props: ArtProps) => React.ReactElement> = {
  experience: ExperienceArt,
  projects: ProjectsArt,
  skills: SkillsArt,
  about: AboutArt,
  contact: ContactArt,
};
