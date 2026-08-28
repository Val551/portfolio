/**
 * One hand-rolled icon set rather than a dependency. Consistent 24px grid,
 * 1.6 stroke, round caps — matched to the PS5's thin system chrome.
 */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 8.2 6a1.4 1.4 0 0 0 1.6 0l8.2-6" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2" />
      <path d="M15 6.2V5.5a2 2 0 0 0-2-2H5.5a2 2 0 0 0-2 2V13a2 2 0 0 0 2 2h.7" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function ArrowOutIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 16 16 8" />
      <path d="M9.5 8H16v6.5" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

/* --- App glyphs. These sit inside the tile art, the way a PS5 app icon
   carries a symbol rather than being a bare colour field. --- */

export function TimelineIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 4v16" />
      <circle cx="5" cy="8" r="1.6" />
      <circle cx="5" cy="16" r="1.6" />
      <path d="M9.5 8H20M9.5 16H17" />
    </svg>
  );
}

export function StackIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m12 3.5 8.5 4.2-8.5 4.2-8.5-4.2Z" />
      <path d="m3.5 12.2 8.5 4.2 8.5-4.2" />
      <path d="m3.5 16.4 8.5 4.1 8.5-4.1" />
    </svg>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 20v-7M5 9.5V4M12 20v-9M12 7.5V4M19 20v-4M19 12.5V4" />
      <circle cx="5" cy="11.2" r="1.8" />
      <circle cx="12" cy="9.2" r="1.8" />
      <circle cx="19" cy="14.2" r="1.8" />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  );
}

/* --- Brand and action marks -------------------------------------------
   GitHub and LinkedIn ship as their official filled marks: a hand-drawn
   approximation of a company logo reads as wrong to anyone who knows it.
   These are solid paths, so they take `fill` rather than the stroke grid
   the reticles use. --- */

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5v12" />
      <path d="m7.5 11 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}
