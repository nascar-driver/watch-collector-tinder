import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import type { Watch } from "@/app/lib/types";
import { formatMoney } from "@/app/lib/format";

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
    <ul className="flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {collected.map((w) => (
          <motion.li
            key={w.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between gap-3 rounded-lg border bg-background/40 px-3 py-2"
          >
            <span className="min-w-0">
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
