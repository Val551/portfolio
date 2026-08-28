import type { ComponentType } from "react";
import { experience } from "./experience";
import { projects } from "./projects";
import { skills } from "./skills";
import {
  TimelineIcon,
  StackIcon,
  SlidersIcon,
  PersonIcon,
  MailIcon,
} from "@/components/ui/icons";

/**
 * The home row. These are the site's "apps" — opening one is the only
 * navigation the site has, exactly as on a console home screen.
 *
 * `blurb` is the line shown under the big title while a tile is focused.
 * Counts are derived from the real content so they can never drift.
 */
export type App = {
  id: string;
  label: string;
  blurb: string | null;
  /** Shown at the right of the title row, like a PS5 hub's meta line. */
  meta: string;
  /** Ambient room tint when this app is focused. */
  hue: number;
  /**
   * Instrument hue of the reticle, from the glass-cockpit family. Kept
   * separate from `hue` deliberately: the room stays the restrained cool
   * grey it is now, while the icons carry the colour. Lightness and chroma
   * come from --instrument-l / --instrument-c so all five stay one family.
   */
  art: number;
  Icon: ComponentType<{ className?: string }>;
};

const totalSkills = skills.reduce((n, group) => n + group.items.length, 0);

export const apps: App[] = [
  {
    id: "experience",
    label: "Experience",
    blurb: "Industry and university research roles, most recent first.",
    meta: `${experience.length} roles`,
    hue: 292,
    // cool band, step 1 of 4 — sections you read
    art: 268,
    Icon: TimelineIcon,
  },
  {
    id: "projects",
    label: "Projects",
    blurb: null,
    meta: `${projects.length} projects`,
    hue: 234,
    // cool band, step 2
    art: 244,
    Icon: StackIcon,
  },
  {
    id: "skills",
    label: "Skills",
    blurb: "Languages, systems and tooling, grouped by where they're used.",
    meta: `${totalSkills} technologies`,
    hue: 212,
    // cool band, step 3
    art: 220,
    Icon: SlidersIcon,
  },
  {
    id: "about",
    label: "About",
    blurb: "Background, coursework, and every way to reach me.",
    meta: "Carnegie Mellon",
    hue: 268,
    // cool band, step 4
    art: 196,
    Icon: PersonIcon,
  },
  {
    id: "contact",
    label: "Contact",
    blurb: "Send a message, or just take the address.",
    meta: "Open to roles",
    hue: 252,
    // the warm outlier: the only section you act on
    art: 42,
    Icon: MailIcon,
  },
];
