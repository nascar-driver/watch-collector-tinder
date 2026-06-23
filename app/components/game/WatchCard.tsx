"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import type { Watch } from "@/app/lib/types";
import { formatMoney } from "@/app/lib/format";
import { WatchImage } from "./WatchImage";

export type Decision = "BUY" | "PASS";

interface WatchCardProps {
  watch: Watch;
  /** Set once the guest has decided — reveals the price and flies the card off. */
  decided: Decision | null;
  /** Called when a drag crosses the swipe threshold. */
  onDecide: (decision: Decision) => void;
  /** Disable dragging (e.g. while a reveal is animating). */
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 110;

export function WatchCard({ watch, decided, onDecide, disabled }: WatchCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-16, 16]);
  const buyTint = useTransform(x, [40, 160], [0, 1]);
  const passTint = useTransform(x, [-40, -160], [0, 1]);

  // When a decision is committed, fly the card off in that direction.
  useEffect(() => {
    if (!decided) return;
    const controls = animate(x, decided === "BUY" ? 700 : -700, {
      type: "spring",
      stiffness: 110,
      damping: 18,
    });
    return () => controls.stop();
  }, [decided, x]);

  const revealed = decided !== null;

  return (
    <motion.div
      className="relative flex aspect-[5/7] w-full max-w-[340px] flex-col overflow-hidden rounded-[28px] border border-line bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] select-none"
      style={{ x, rotate }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragSnapToOrigin
      whileTap={{ cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      onDragEnd={(_, info) => {
        if (disabled) return;
        if (info.offset.x > SWIPE_THRESHOLD) onDecide("BUY");
        else if (info.offset.x < -SWIPE_THRESHOLD) onDecide("PASS");
      }}
    >
      {/* color tints while dragging */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 bg-buy/15"
        style={{ opacity: revealed ? (decided === "BUY" ? 1 : 0) : buyTint }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 bg-bust/15"
        style={{ opacity: revealed ? (decided === "PASS" ? 1 : 0) : passTint }}
      />

      {/* BUY / PASS stamps */}
      <motion.div
        className="pointer-events-none absolute top-6 left-6 z-20 -rotate-12 rounded-md border-2 border-buy px-3 py-1 text-2xl tracking-brand text-buy"
        style={{ opacity: revealed ? (decided === "BUY" ? 1 : 0) : buyTint }}
      >
        BUY
      </motion.div>
      <motion.div
        className="pointer-events-none absolute top-6 right-6 z-20 rotate-12 rounded-md border-2 border-bust px-3 py-1 text-2xl tracking-brand text-bust"
        style={{ opacity: revealed ? (decided === "PASS" ? 1 : 0) : passTint }}
      >
        PASS
      </motion.div>

      {/* watch image */}
      <div className="flex min-h-0 flex-1 items-center justify-center p-6 pt-10">
        <WatchImage watch={watch} />
      </div>

      {/* info footer */}
      <div className="shrink-0 border-t border-line px-6 py-5">
        <div className="text-xs uppercase tracking-[0.22em] text-gold">
          {watch.brand}
        </div>
        <div className="mt-1 text-2xl leading-tight text-cream">{watch.model}</div>
        <div className="mt-3 text-3xl">
          {revealed ? (
            <span className={decided === "BUY" ? "text-buy" : "text-bust"}>
              {formatMoney(watch.price)}
            </span>
          ) : (
            <span
              className="tracking-[0.4em] text-cream/35"
              aria-label="price hidden"
            >
              ? ? ?
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
