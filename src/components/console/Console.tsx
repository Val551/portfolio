"use client";

import { useCallback, useEffect } from "react";
import { BootScreen } from "./BootScreen";
import { LockScreen } from "./LockScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ConsoleShell } from "./ConsoleShell";
import { useAmbient } from "@/hooks/useAmbient";

/**
 * The start-up flow: power on, unlock, pick a user, land on the home menu.
 *
 * Two rules govern it. Every stage is skippable with any key or click, so a
 * recruiter is never held hostage by an animation. And anyone who has asked
 * for reduced motion passes straight through the boot — BootScreen shortens
 * its own dwell to a beat. The sequence is atmosphere, not content.
 */
export function Console() {
  // Stage lives in the ambient context because the room needs it too: the
  // background is what carries the figure during unlock, and mirroring this
  // one value into it with an effect would be a cascading render for nothing.
  const { stage, setStage } = useAmbient();

  // Computed from the current stage rather than a functional update: the
  // room owns this state now and exposes a plain setter.
  const advance = useCallback(() => {
    setStage(stage === "boot" ? "lock" : stage === "lock" ? "profile" : stage);
  }, [stage, setStage]);

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
  }, [advance, setStage, stage]);

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
