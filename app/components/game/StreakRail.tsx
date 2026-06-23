"use client";

import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";
import { motion, useAnimationControls } from "motion/react";
import { AnimatedCount } from "./AnimatedNumber";

const DOTS = 5;

interface StreakRailProps {
  /** Current consecutive-buy run. */
  current: number;
}

export function StreakRail({ current }: StreakRailProps) {
  // Dots show progress within the current round of 5; they wrap and refill
  // every 5 buys (round 1: 1..5, round 2 starts again at 1, …).
  const filled = current === 0 ? 0 : ((current - 1) % DOTS) + 1;
  const completedRounds = Math.floor(current / DOTS);
  const onStreak = current > 0;

  // Subtly highlight (brighten) the row whenever a set of 5 completes — no motion.
  const controls = useAnimationControls();
  const prevRounds = useRef(completedRounds);
  useEffect(() => {
    if (completedRounds > prevRounds.current) {
      controls.start({
        filter: ["brightness(1)", "brightness(1.7)", "brightness(1)"],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
    prevRounds.current = completedRounds;
  }, [completedRounds, controls]);

  return (
    <div
      className="w-[360px] rounded-[1.75rem] p-6"
      style={{
        background: "var(--background-secondary)",
        border: ".0625rem solid rgba(216, 185, 135, 0.28)",
        backdropFilter: "blur(1.25rem)",
        WebkitBackdropFilter: "blur(1.25rem)",
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Streaks
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <AnimatedCount
            value={current}
            className="text-gold-gradient text-[2.75rem] leading-none tabular-nums"
          />
          <span className="text-sm lowercase text-muted-foreground/60">
            in a row
          </span>
        </div>

        <motion.div animate={controls} className="flex items-center gap-2">
          {Array.from({ length: DOTS }).map((_, i) => {
            const on = i < filled;
            return (
              <motion.span
                key={i}
                initial={false}
                animate={
                  on
                    ? {
                        backgroundColor: "#d8b987",
                        borderColor: "rgba(216, 185, 135, 0)",
                        boxShadow: "0 0 10px 1px rgba(216, 185, 135, 0.65)",
                      }
                    : {
                        backgroundColor: "rgba(216, 185, 135, 0)",
                        borderColor: "rgba(248, 239, 211, 0.25)",
                        boxShadow: "0 0 0 0 rgba(216, 185, 135, 0)",
                      }
                }
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="size-3 rounded-full border"
              />
            );
          })}
          <Flame
            className={
              "ml-1 size-4 transition-colors " +
              (onStreak ? "fill-primary/30 text-primary" : "text-muted-foreground/40")
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
