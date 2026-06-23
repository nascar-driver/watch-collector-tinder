"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { formatMoney } from "@/app/lib/format";

const SPRING = { stiffness: 120, damping: 26, mass: 0.6 } as const;

/** A dollar figure that smoothly counts to its new value when `value` changes. */
export function AnimatedMoney({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(value, SPRING);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) => formatMoney(v));
  return <motion.span className={className}>{text}</motion.span>;
}

/** A whole-number count that smoothly ticks up/down when `value` changes. */
export function AnimatedCount({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(value, SPRING);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("en-US"));
  return <motion.span className={className}>{text}</motion.span>;
}
