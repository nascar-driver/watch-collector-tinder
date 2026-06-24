import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Watch } from "@/app/lib/types";
import { formatMoney } from "@/app/lib/format";
import { WatchImage } from "./WatchImage";

/** Shared list of collected watches — used in the desktop rail and the mobile drawer. */
export function CollectionList({ collected }: { collected: Watch[] }) {
  if (collected.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        No watches yet. Start stacking the collection.
      </p>
    );
  }

  return (
    // `perspective` lets each row lift toward the viewer on hover (translateZ).
    // `py` gives the lifted top/bottom rows room so the scroll container's
    // overflow clip doesn't shave them.
    <ul className="flex flex-col gap-2 py-1.5" style={{ perspective: 600 }}>
      <AnimatePresence initial={false}>
        {collected.map((w) => (
          <motion.li
            key={w.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{
              z: 18,
              zIndex: 10,
              boxShadow: "0 14px 28px -10px rgba(0,0,0,0.75)",
            }}
            // Tween (no spring overshoot) + own GPU layer keeps text from
            // re-rasterizing/wiggling as the row lifts.
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className="relative flex items-center gap-3 rounded-lg border bg-background/40 px-3 py-3.5"
          >
            <span className="size-14 shrink-0">
              <WatchImage watch={w} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-foreground/90">
                {w.model}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-primary/70">
                {w.brand}
              </span>
            </span>
            <Badge variant="outline" className="shrink-0 tabular-nums text-primary">
              {formatMoney(w.price)}
            </Badge>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
