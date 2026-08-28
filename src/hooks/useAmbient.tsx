"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * The room is a place, and the selection moves a light through it.
 *
 * Everything here is a POSITION rather than an event, which is the whole
 * point: the ambient layer's resting state is always correct on its own, and
 * the transitions only describe how it travels between resting states. A
 * stalled or throttled clock leaves the room in the right place rather than
 * mid-animation, which is the failure this codebase has hit before.
 */
export type Stage = "boot" | "lock" | "profile" | "home";

type AmbientState = {
  /** Room tint, in OKLCH degrees. */
  hue: number;
  /** Where the focused app sits in the row, 0 to 1. Pans the room. */
  pan: number;
  /** Identity of the focused app. Changing it replays the light bloom. */
  mark: string;
};

type AmbientValue = AmbientState & {
  /**
   * Which screen of the start-up sequence is showing. The room reads it to
   * decide what is in it — the figure is only ever present while the console
   * is being unlocked. Owned here rather than in <Console> so that one piece
   * of state does not have to be mirrored into the background with an effect.
   */
  stage: Stage;
  /** True while a hub covers the home screen; the room drops back. */
  recessed: boolean;
  setStage: (next: Stage) => void;
  setAmbient: (next: AmbientState) => void;
  setRecessed: (next: boolean) => void;
};

const INITIAL: AmbientState = { hue: 252, pan: 0, mark: "boot" };

const AmbientContext = createContext<AmbientValue | null>(null);

export function AmbientProvider({ children }: { children: ReactNode }) {
  const [state, setAmbient] = useState<AmbientState>(INITIAL);
  const [recessed, setRecessed] = useState(false);
  const [stage, setStage] = useState<Stage>("boot");

  const value = useMemo<AmbientValue>(
    () => ({ ...state, stage, recessed, setStage, setAmbient, setRecessed }),
    [state, stage, recessed],
  );

  return <AmbientContext value={value}>{children}</AmbientContext>;
}

export function useAmbient(): AmbientValue {
  const ctx = useContext(AmbientContext);
  if (!ctx) throw new Error("useAmbient must be used inside <AmbientProvider>");
  return ctx;
}
