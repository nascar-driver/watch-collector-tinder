"use client";

import { useCallback, useEffect, useState } from "react";
import { useGame } from "@/app/state/GameProvider";
import { currentWatch, remaining } from "@/app/lib/game";
import { formatHandle } from "@/app/lib/format";
import { Logo } from "@/app/components/brand/Logo";
import { WatchCard, type Decision } from "@/app/components/game/WatchCard";
import { StatRail } from "@/app/components/game/StatRail";
import { StreakRail } from "@/app/components/game/StreakRail";
import { CollectionRail } from "@/app/components/game/CollectionRail";
import { MobileStatBar } from "@/app/components/game/MobileStatBar";
import { SwipeHint } from "@/app/components/game/SwipeHint";

/** How long the price stays revealed before advancing to the next card. */
const REVEAL_MS = 1400;

export function GameScreen() {
  const { state, dispatch } = useGame();
  const watch = currentWatch(state);
  const [decision, setDecision] = useState<Decision | null>(null);

  const decide = useCallback(
    (d: Decision) => {
      if (decision || state.phase !== "playing" || !watch) return;
      setDecision(d);
    },
    [decision, state.phase, watch],
  );

  // After the reveal delay, commit the decision to the reducer and advance.
  useEffect(() => {
    if (!decision) return;
    const timer = setTimeout(() => {
      dispatch({ type: decision === "BUY" ? "BUY" : "PASS" });
      setDecision(null);
    }, REVEAL_MS);
    return () => clearTimeout(timer);
  }, [decision, dispatch]);

  // Keyboard controls for the interviewer (desktop).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.phase !== "playing") return;
      // Don't hijack browser shortcuts (e.g. Ctrl/Cmd+C to copy).
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowLeft") decide("PASS");
      else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        decide("BUY");
      } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
        if (!decision) dispatch({ type: "CASH_OUT" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.phase, decide, dispatch, decision]);

  const busy = decision !== null;

  return (
    <div className="flex min-h-dvh flex-col gap-4 p-4 lg:h-dvh lg:gap-6 lg:overflow-hidden lg:p-8">
      {/* header */}
      <header className="flex shrink-0 items-center justify-between gap-3">
        <Logo size={28} withWordmark />
        <div className="min-w-0 text-right">
          <div className="hidden text-sm uppercase tracking-[0.3em] text-primary sm:block">
            Collector Tinder
          </div>
          <div className="truncate text-sm text-muted-foreground">
            {state.guest.name}
            {state.guest.xHandle ? (
              <span className="opacity-70"> · {formatHandle(state.guest.xHandle)}</span>
            ) : null}
          </div>
        </div>
      </header>

      {/* main: stacks on mobile, 3-up on desktop */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-8">
        {/* desktop: left rail — budget stats + streaks */}
        <div className="hidden lg:flex lg:shrink-0 lg:flex-col lg:gap-6 lg:self-center">
          <StatRail
            budget={state.startingBudget}
            remaining={remaining(state)}
            spent={state.spent}
          />
          <StreakRail current={state.streak} />
        </div>

        {/* mobile: compact stat bar + collection drawer */}
        <div className="lg:hidden">
          <MobileStatBar
            budget={state.startingBudget}
            remaining={remaining(state)}
            spent={state.spent}
            collected={state.collected}
            streak={state.streak}
            onCashOut={() => dispatch({ type: "CASH_OUT" })}
            disabled={busy}
          />
        </div>

        {/* center: the swipe card (single instance, shared across breakpoints) */}
        <div className="relative z-20 flex flex-1 items-center justify-center">
          {watch && (
            <WatchCard
              key={watch.id}
              watch={watch}
              decided={decision}
              onDecide={decide}
              disabled={busy}
            />
          )}
        </div>

        {/* desktop: right collection rail */}
        <div className="hidden lg:block lg:w-[360px] lg:shrink-0">
          <CollectionRail
            collected={state.collected}
            value={state.spent}
            onCashOut={() => dispatch({ type: "CASH_OUT" })}
            disabled={busy}
          />
        </div>
      </div>

      {/* play instruction */}
      <div className="shrink-0">
        <SwipeHint />
      </div>
    </div>
  );
}
