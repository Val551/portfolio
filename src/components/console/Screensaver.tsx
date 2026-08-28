/**
 * The screensaver a console drops into when you walk away.
 *
 * Deliberately the one place on this site with no professional content and
 * no job to do. A recruiter deciding in thirty seconds will never see it;
 * anyone who leaves the tab open for a minute gets the whole thing.
 *
 * The artwork is white ink on pure black, so `mix-blend-mode: screen` drops
 * the black entirely and leaves the linework floating in the room. No cutout,
 * no alpha channel needed.
 *
 * Not `pointer-events: none`. The layer absorbs the click that dismisses it,
 * which is what a console does: the first input wakes the screen, it does not
 * also press whatever was underneath.
 */
export function Screensaver() {
  return (
    <div className="screensaver" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/luffy.webp"
        alt=""
        width={1400}
        height={929}
        decoding="async"
        className="screensaver__art"
      />
    </div>
  );
}
