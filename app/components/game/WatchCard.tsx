"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useSpring,
  animate,
} from "motion/react";
import type { Watch } from "@/app/lib/types";
import { formatMoney } from "@/app/lib/format";
import { WatchImage } from "./WatchImage";
import { Logo } from "@/app/components/brand/Logo";

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

export function WatchCard({
  watch,
  decided,
  onDecide,
  disabled,
}: WatchCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-16, 16]);
  const buyTint = useTransform(x, [40, 160], [0, 1]);
  const passTint = useTransform(x, [-40, -160], [0, 1]);

  // Mouse-based 3D tilt — springs back to flat when the pointer leaves.
  const tiltX = useSpring(0, { stiffness: 150, damping: 15 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 15 });
  const MAX_TILT = 12;

  // Specular glare — a soft highlight that reflects off the card surface.
  // Its position moves opposite the pointer (as a fixed light would) and it
  // brightens as the card tilts further, so light appears to catch the surface.
  const glareX = useSpring(50, { stiffness: 150, damping: 18 });
  const glareY = useSpring(50, { stiffness: 150, damping: 18 });
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 32%, rgba(255,255,255,0) 70%)`;

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * MAX_TILT);
    tiltX.set(-py * MAX_TILT);
    // Reflect the highlight opposite the cursor; intensity tracks tilt distance.
    glareX.set((0.5 - px) * 100);
    glareY.set((0.5 - py) * 100);
    glareOpacity.set(0.18 + Math.min(0.27, Math.hypot(px, py) * 0.55));
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(50);
    glareY.set(50);
    glareOpacity.set(0);
  };

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
      className="relative flex aspect-[5/8] w-full max-w-[380px] flex-col overflow-hidden rounded-[28px] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] select-none"
      style={{
        x,
        rotate,
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        background: "var(--background-secondary)",
        backdropFilter: "blur(1.25rem)",
        WebkitBackdropFilter: "blur(1.25rem)",
        touchAction: "none",
      }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragSnapToOrigin
      whileTap={{ cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
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

      {/* specular glare — reflects off the surface as the card tilts */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 mix-blend-screen"
        style={{ background: glare, opacity: glareOpacity }}
      />

      {/* watch.fun logomark */}
      <div className="pointer-events-none absolute top-5 right-5 z-20">
        <Logo size={64} />
      </div>

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

      {/* watch image — lifted off the card surface so it reads as floating */}
      <div
        className="pointer-events-none relative flex min-h-0 flex-1 items-center justify-center p-3 pt-6"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* soft contact shadow cast on the card surface; reacts to the bob */}
        <motion.div
          className="absolute bottom-5 left-1/2 -z-10 h-7 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/55 blur-xl"
          animate={{ scaleX: [1, 0.82, 1], opacity: [0.55, 0.32, 0.55] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* the watch itself, pushed toward the viewer + a gentle vertical drift */}
        <motion.div
          className="relative flex h-full w-full items-center justify-center"
          style={{ translateZ: 60 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <WatchImage watch={watch} />
        </motion.div>
      </div>

      {/* info panel — a nested card sitting under the watch */}
      <div
        className="pointer-events-none shrink-0 rounded-[20px] px-5 py-4 ring-1 ring-white/5"
        style={{ background: "rgba(8, 5, 9, 0.55)" }}
      >
        <div className="text-xs uppercase tracking-[0.22em] text-gold">
          {watch.brand}
        </div>
        <div className="mt-1 text-2xl leading-tight text-cream">
          {watch.model}
        </div>
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
