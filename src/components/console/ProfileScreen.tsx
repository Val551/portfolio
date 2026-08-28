"use client";

import { useEffect, useRef } from "react";
import { PersonIcon } from "@/components/ui/icons";

/**
 * User select. One profile, because the visitor is the recruiter and the site
 * has no accounts — so the screen asks the question and gets out of the way.
 */
export function ProfileScreen({ onSelect }: { onSelect: () => void }) {
  const guestRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    guestRef.current?.focus();
  }, []);

  return (
    <div className="grid h-[100svh] place-items-center px-[var(--gutter)]">
      <div className="lock-in flex flex-col items-center">
        <h1 className="text-center text-h2 font-normal text-ink">
          Who&rsquo;s visiting?
        </h1>

        <button
          ref={guestRef}
          type="button"
          onClick={onSelect}
          className="group mt-12 flex w-36 flex-col items-center gap-4 rounded-md focus-visible:outline-none sm:w-40"
        >
          <span
            aria-hidden="true"
            className="grid aspect-square w-full place-items-center rounded-full bg-raised text-ink-muted ring-1 ring-[var(--hairline)] transition-[transform,box-shadow,color,background-color] duration-[var(--d-focus)] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:bg-raised-hi group-hover:text-ink group-focus-visible:scale-[1.06] group-focus-visible:text-ink group-focus-visible:shadow-[var(--e-focus)]"
          >
            <PersonIcon className="size-[42%]" />
          </span>
          <span className="text-body font-medium text-ink">Guest</span>
        </button>
      </div>
    </div>
  );
}
