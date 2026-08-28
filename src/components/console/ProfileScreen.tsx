"use client";

import { useEffect, useRef } from "react";
import { PersonIcon } from "@/components/ui/icons";

/**
 * User select. One profile, because the visitor is the recruiter and the site
 * has no accounts — so the screen asks the question and gets out of the way.
 *
 * This is also where the personality goes, and it is the right place for it
 * on purpose: on a real console the user screen is the one surface that is
 * yours rather than the system's, and it is the only screen here carrying no
 * professional content at all. Put a character in About or Projects and it
 * competes with the work; put it on the way in and it just reads as taste.
 *
 * The composition shifts left of centre from md up to make room. Below that
 * the artwork is dropped rather than shrunk: at phone width it would either
 * sit under the question or be too small to read as anything.
 */
export function ProfileScreen({ onSelect }: { onSelect: () => void }) {
  const guestRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    guestRef.current?.focus();
  }, []);

  return (
    <div className="relative grid h-[100svh] place-items-center overflow-hidden px-[var(--gutter)] md:justify-items-start md:pl-[9vw]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[-4%] hidden w-[56%] items-center md:flex"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/luffy.webp"
          alt=""
          width={1400}
          height={929}
          decoding="async"
          className="profile-art w-full"
        />
      </div>

      <div className="lock-in relative flex flex-col items-center">
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
