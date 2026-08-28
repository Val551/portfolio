"use client";

import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./BootScreen";
import { LockScreen } from "./LockScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ConsoleShell } from "./ConsoleShell";

type Stage = "boot" | "lock" | "profile" | "home";

/**
 * The start-up flow: power on, unlock, pick a user, land on the home menu.
 *
 * Two rules govern it. Every stage is skippable with any key or click, so a
 * recruiter is never held hostage by an animation. And anyone who has asked
 * for reduced motion passes straight through the boot — BootScreen shortens
 * its own dwell to a beat. The sequence is atmosphere, not content.
 */
export function Console() {
  const [stage, setStage] = useState<Stage>("boot");

  const advance = useCallback(() => {
    setStage((current) =>
      current === "boot" ? "lock" : current === "lock" ? "profile" : current,
    );
  }, []);

  // Any key advances the pre-home stages. Once home, ConsoleShell owns the
  // keyboard, so this listener steps out of the way entirely.
  useEffect(() => {
    if (stage === "home") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Tab") return; // let people tab to the buttons

      const target = event.target instanceof Element ? event.target : null;
      // Enter/Space on a focused button is that button's job, not ours.
      if (target?.closest("button") && (event.key === "Enter" || event.key === " ")) {
        return;
      }

      event.preventDefault();
      if (stage === "profile") setStage("home");
      else advance();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, stage]);

  if (stage === "boot") {
    return (
      <div onClick={advance} className="cursor-pointer">
        <BootScreen onDone={advance} />
      </div>
    );
  }

  if (stage === "lock") return <LockScreen onContinue={advance} />;

  if (stage === "profile") {
    return <ProfileScreen onSelect={() => setStage("home")} />;
  }

  return <ConsoleShell />;
}
