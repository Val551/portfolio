"use client";

import { profile } from "@/content/profile";

/**
 * The lock screen from the reference: a single circular mark, centred, with
 * one line of instruction above it. Everything else is the room — key light
 * from the top-left, warm particles low and to the right.
 *
 * The whole screen is one button, so a click anywhere continues; the shell
 * also accepts any key. There is no way to get stuck here.
 */
export function LockScreen({ onContinue }: { onContinue: () => void }) {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="relative grid h-[100svh] place-items-center">
      <div className="lock-in flex flex-col items-center gap-10">
        <p className="text-center text-[clamp(1rem,2.2vw,1.35rem)] font-light text-ink">
          Press <kbd className="font-sans font-normal">Enter</kbd> to continue
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="group relative grid size-[clamp(5rem,9vw,6.5rem)] place-items-center rounded-full focus-visible:outline-none"
        >
          {/* The ring that blooms on hover and focus, as in the reference. */}
          <span
            aria-hidden="true"
            className="absolute inset-[-18%] rounded-full border border-white/55 opacity-0 transition-[opacity,transform] duration-400 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-safe:scale-90"
          />
          <span
            aria-hidden="true"
            className="grid size-full place-items-center rounded-full bg-ink text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold tracking-[-0.02em] text-void shadow-[0_8px_36px_-8px_oklch(0_0_0_/_0.7)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-active:scale-[0.98]"
          >
            {initials}
          </span>
          <span className="sr-only">
            Continue to {profile.name}&rsquo;s portfolio
          </span>
        </button>
      </div>
    </div>
  );
}
