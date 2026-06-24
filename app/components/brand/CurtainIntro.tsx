"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Logo } from "@/app/components/brand/Logo";

/** Size of the (split) logomark sitting at the seam. */
const LOGO = 168;
const DELAY = 0.5; // hold the closed curtain briefly before opening
const DURATION = 1.1;
const EASE = [0.65, 0, 0.35, 1] as const; // ease-in-out, theatrical

const CURTAIN_EVENT = "watchfun:curtain";

/** Replay the curtain intro (e.g. on "Play Again"). Safe to call client-side. */
export function playCurtain() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CURTAIN_EVENT));
  }
}

/**
 * Theater-curtain intro shown on first paint and on demand via {@link playCurtain}.
 * Two panels, each painted with its half of the page's background gradient so the
 * closed curtain is seamless with the page behind it. The watch.fun logomark
 * straddles the seam — each panel clips it to one half, so it splits apart as the
 * curtains open. Rendered in the initial HTML (covers content immediately), then
 * animates open on hydration and hides itself until triggered again.
 */
export function CurtainIntro() {
  // `run` bumps on each play to remount the panels and restart the animation;
  // `playing` toggles the overlay's visibility between runs.
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const onPlay = () => {
      setRun((r) => r + 1);
      setPlaying(true);
    };
    window.addEventListener(CURTAIN_EVENT, onPlay);
    return () => window.removeEventListener(CURTAIN_EVENT, onPlay);
  }, []);

  if (!playing) return null;

  const panelBase: React.CSSProperties = {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "50%",
    overflow: "hidden",
    background: "var(--bg-gradient)",
    backgroundColor: "#0a0a0a",
    backgroundSize: "100vw 100vh",
  };

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: "none" }}
    >
      {/* left curtain — shows the left half of the gradient + left half of logo */}
      <motion.div
        key={`left-${run}`}
        style={{ ...panelBase, left: 0, backgroundPosition: "left top" }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ delay: DELAY, duration: DURATION, ease: EASE }}
        onAnimationComplete={() => setPlaying(false)}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translate(50%, -50%)",
          }}
        >
          <Logo size={LOGO} />
        </div>
      </motion.div>

      {/* right curtain — shows the right half of the gradient + right half of logo */}
      <motion.div
        key={`right-${run}`}
        style={{ ...panelBase, right: 0, backgroundPosition: "right top" }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ delay: DELAY, duration: DURATION, ease: EASE }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Logo size={LOGO} />
        </div>
      </motion.div>
    </div>
  );
}
