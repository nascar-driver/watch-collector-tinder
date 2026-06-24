"use client";

import { motion, useSpring } from "motion/react";

/**
 * Wraps content in a motion layer that tilts in 3D toward the cursor and
 * springs back flat when the pointer leaves. Mouse-only (no effect on touch).
 */
export function TiltCard({
  children,
  className,
  max = 10,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. */
  max?: number;
}) {
  const tiltX = useSpring(0, { stiffness: 150, damping: 15 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * max);
    tiltX.set(-py * max);
  };
  const reset = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
