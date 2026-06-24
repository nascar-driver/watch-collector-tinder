"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/app/components/brand/Logo";

const LOADING_EVENT = "watchfun:loading";
const HOLD_MS = 1500; // how long the loader stays up before revealing results

/** Show the cash-out loading screen. Safe to call client-side. */
export function playCashOutLoading() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOADING_EVENT));
  }
}

/**
 * Full-screen loading veil shown after Cash Out — the page background with a
 * spinning watch.fun logomark — that holds briefly then fades to reveal the end
 * screen (which mounts behind it). Triggered via {@link playCashOutLoading}.
 */
export function CashOutLoader() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onLoad = () => setActive(true);
    window.addEventListener(LOADING_EVENT, onLoad);
    return () => window.removeEventListener(LOADING_EVENT, onLoad);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), HOLD_MS);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="cashout-loader"
          // Appear instantly (no fade-in) so it covers the end screen the
          // moment CASH_OUT flips the phase; only the exit fades out.
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            background: "var(--bg-gradient)",
            backgroundColor: "#0a0a0a",
          }}
        >
          <motion.div
            style={{ display: "flex" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1.6 }}
          >
            <Logo size={92} />
          </motion.div>
          <div
            style={{
              fontFamily: "var(--font-made-carving), sans-serif",
              fontSize: 14,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(245, 236, 217, 0.55)",
            }}
          >
            Cashing out…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
