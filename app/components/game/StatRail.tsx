"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { formatMoney } from "@/app/lib/format";

interface StatRailProps {
  budget: number;
  remaining: number;
  spent: number;
}

const SPRING = { stiffness: 120, damping: 26, mass: 0.6 } as const;

/** A money figure that smoothly counts to its new value when it changes. */
function useMoneySpring(value: number): MotionValue<string> {
  const spring = useSpring(value, SPRING);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return useTransform(spring, (v) => formatMoney(v));
}

export function StatRail({ budget, remaining, spent }: StatRailProps) {
  const safeBudget = budget || 1;

  // Drive the headline figure, the bar width and the % labels from one spring
  // so they all glide together as the user spends.
  const remSpring = useSpring(remaining, SPRING);
  useEffect(() => {
    remSpring.set(remaining);
  }, [remaining, remSpring]);

  const remainingText = useTransform(remSpring, (v) => formatMoney(v));
  const barWidth = useTransform(remSpring, (v) =>
    `${Math.max(0, Math.min(100, (v / safeBudget) * 100)).toFixed(2)}%`,
  );
  const liquidLabel = useTransform(
    remSpring,
    (v) => `${((Math.max(0, v) / safeBudget) * 100).toFixed(1)}% LIQUID`,
  );
  const spentLabel = useTransform(
    remSpring,
    (v) => `${(100 - (Math.max(0, v) / safeBudget) * 100).toFixed(1)}% SPENT`,
  );

  const spentText = useMoneySpring(spent);

  return (
    <div
      className="w-[360px] rounded-[1.75rem] p-6"
      style={{
        background: "var(--background-secondary)",
        border: ".0625rem solid rgba(157, 92, 255, 0.28)",
        backdropFilter: "blur(1.25rem)",
        WebkitBackdropFilter: "blur(1.25rem)",
      }}
    >
      {/* Remaining headline */}
      <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        Remaining
      </div>
      <motion.div className="text-brand-gradient mt-1 text-[2.75rem] leading-none tabular-nums">
        {remainingText}
      </motion.div>

      {/* Liquid vs spent bar */}
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[rgb(229_227_232_/_8%)]">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: barWidth,
            background:
              "linear-gradient(90deg, #7032cf, #9d5cff 55%, #c198ff)",
            boxShadow: "0 0 8px rgba(157, 92, 255, 0.45)",
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        <motion.span className="tabular-nums">{liquidLabel}</motion.span>
        <motion.span className="tabular-nums">{spentLabel}</motion.span>
      </div>

      <div className="my-6 border-t border-[rgb(229_227_232_/_10%)]" />

      {/* Budget / Spent footer */}
      <div className="grid grid-cols-2">
        <div className="pr-5">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Budget
          </div>
          <div className="text-brand-gradient mt-1 text-xl tabular-nums">
            {formatMoney(budget)}
          </div>
          <div className="mt-0.5 text-xs lowercase text-muted-foreground">
            ceiling
          </div>
        </div>
        <div className="border-l border-[rgb(229_227_232_/_10%)] pl-5">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Spent
          </div>
          <motion.div className="text-brand-gradient mt-1 text-xl tabular-nums">
            {spentText}
          </motion.div>
          <div className="mt-0.5 flex items-center gap-1 text-xs lowercase text-buy">
            <span className="text-[0.6rem] leading-none">▲</span> portfolio
          </div>
        </div>
      </div>
    </div>
  );
}
