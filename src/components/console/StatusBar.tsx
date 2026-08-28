import { profile } from "@/content/profile";
import { Clock } from "@/components/chrome/Clock";

/**
 * The thin strip across the top of a console home screen: who is signed in
 * on the left, system status on the right. Deliberately small and
 * high-contrast so it never competes with the row below.
 */
export function StatusBar() {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    // The key light is brightest exactly here, so the bar carries its own
    // top-down scrim. Without it the faint ink in this row drops to 3.2:1.
    // Dimming the light instead would cost the whole screen its atmosphere.
    <header className="relative flex items-center justify-between gap-4 bg-linear-to-b from-void/78 via-void/45 to-transparent px-[var(--gutter)] pt-[max(0.9rem,env(safe-area-inset-top))] pb-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-label font-semibold text-ink ring-1 ring-[var(--hairline-strong)]"
        >
          {initials}
        </span>
        <p className="min-w-0 truncate text-small font-medium text-ink">
          {profile.name}
        </p>
        <span
          aria-hidden="true"
          className="hidden h-4 w-px shrink-0 bg-[var(--hairline-strong)] sm:block"
        />
        <p className="hidden truncate text-label text-ink-faint sm:block">
          {profile.affiliation}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          // Padding grows the tap target to 44px without changing how the
          // row looks; the negative margin keeps the bar its original height.
          className="-my-3.5 rounded-sm py-3.5 text-label text-ink-faint transition-colors duration-200 hover:text-ink"
        >
          {profile.email}
        </a>
        <Clock />
      </div>
    </header>
  );
}
