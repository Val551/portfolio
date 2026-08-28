/**
 * Content types for the site.
 *
 * Fields typed `| null` are genuinely absent rather than pending: the
 * résumé states no stack for Engineering OS and lists no GitHub profile.
 * Components render only what exists, so nothing ever ships as filler prose
 * or a dead link.
 */

export type Profile = {
  name: string;
  affiliation: string;
  degree: string;
  school: string;
  /** First-person introduction shown at the top of About. */
  intro: string;
  /** Portrait for About. Intrinsic size prevents layout shift. */
  portrait: { src: string; alt: string; w: number; h: number };
  graduation: string;
  coursework: string[];
  email: string;
  linkedin: string | null;
  github: string | null;
  /** Path under /public. */
  resume: string | null;
};

export type Activity = {
  id: string;
  organization: string;
  role: string;
  /** Human-readable range, rendered as a system timestamp. */
  period: string;
  bullets: string[];
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  /** One line for the library card. The summary is for the detail view. */
  blurb: string;
  stack: string[];
  /**
   * Framing for the library card's cover. A capture is authored at desktop
   * width; dropped into a 340px card at 1:1 a dense one becomes texture
   * rather than a screenshot. Zoom in and anchor the crop where the app is
   * legible. Defaults to 1 / center, which is right for a capture that
   * already reads at card size.
   */
  coverZoom?: number;
  /** CSS `transform-origin` for the zoom above. */
  coverOrigin?: string;
  repo: string | null;
  demo: string | null;
  /**
   * Why the project can't simply be linked. Rendered in place of the
   * missing repo/demo links so the absence reads as a fact about the
   * project rather than an oversight.
   */
  access: string | null;
  /** Captures from the running app, in the order they should be shown. */
  shots: {
    src: string;
    label: string;
    caption: string;
    /** Intrinsic size — drives the pane's aspect and prevents layout shift. */
    w: number;
    h: number;
  }[];
  /** Instrument hue for the card, viewer and cover art. */
  hue: number;
};

export type SkillGroup = {
  label: string;
  items: string[];
};
