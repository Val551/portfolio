import type { ReactNode } from "react";

/**
 * The button legend a console keeps pinned to the bottom of the screen. Here
 * it doubles as real keyboard documentation: every hint listed is a shortcut
 * that actually works.
 */
function Hint({ keys, children }: { keys: string[]; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="grid h-6 min-w-6 place-items-center rounded-xs border border-[var(--hairline-strong)] px-1.5 text-[0.6875rem] leading-none text-ink-muted"
          >
            {key}
          </kbd>
        ))}
      </span>
      <span className="text-label text-ink-faint">{children}</span>
    </span>
  );
}

export function HintBar({ open }: { open: boolean }) {
  return (
    // Hidden where there is no keyboard: on a touch device the tiles are
    // tapped and the hub carries a visible close button, so a legend of
    // keys the reader does not have is just noise.
    <footer className="hidden items-center justify-end gap-5 px-[var(--gutter)] pt-2 pb-[max(0.9rem,env(safe-area-inset-bottom))] [@media(any-hover:hover)]:flex">
      {open ? (
        <>
          <Hint keys={["Tab"]}>Move through</Hint>
          <Hint keys={["Esc"]}>Back</Hint>
        </>
      ) : (
        <>
          <Hint keys={["←", "→"]}>Browse</Hint>
          <Hint keys={["Enter"]}>Open</Hint>
        </>
      )}
    </footer>
  );
}
