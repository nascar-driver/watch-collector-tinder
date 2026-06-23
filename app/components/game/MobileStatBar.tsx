import { ChevronUp } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { Watch } from "@/app/lib/types";
import { formatMoney } from "@/app/lib/format";
import { AnimatedCount, AnimatedMoney } from "./AnimatedNumber";
import { CollectionList } from "./CollectionList";

interface MobileStatBarProps {
  budget: number;
  remaining: number;
  spent: number;
  collected: Watch[];
  streak: number;
  onCashOut: () => void;
  disabled?: boolean;
}

/** Compact HUD for mobile: Remaining headline, budget/spent/streak, and a collection drawer. */
export function MobileStatBar({
  budget,
  remaining,
  spent,
  collected,
  streak,
  onCashOut,
  disabled,
}: MobileStatBarProps) {
  return (
    <div className="rounded-2xl border bg-card/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Remaining
          </div>
          <AnimatedMoney
            value={remaining}
            className="text-gold-gradient text-3xl tabular-nums"
          />
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Collected · <AnimatedCount value={collected.length} className="tabular-nums" />
              <ChevronUp data-icon="inline-end" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-gold-gradient text-2xl uppercase">
                Your Collection
              </DrawerTitle>
              <DrawerDescription>
                {formatMoney(spent)} · {collected.length} watches
              </DrawerDescription>
            </DrawerHeader>
            <div className="scrollbar-hide max-h-[55vh] overflow-y-auto px-4 pb-8">
              <CollectionList collected={collected} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
        <span>
          Budget{" "}
          <span className="text-foreground/80 tabular-nums">
            {formatMoney(budget)}
          </span>
        </span>
        <span>
          Spent{" "}
          <AnimatedMoney value={spent} className="text-foreground/80 tabular-nums" />
        </span>
        <span>
          Streak{" "}
          <AnimatedCount value={streak} className="text-foreground/80 tabular-nums" />
        </span>
      </div>

      <Button
        onClick={onCashOut}
        disabled={disabled}
        className="mt-3 h-11 w-full text-base"
        aria-label="Cash out and end the game"
      >
        Cash Out
      </Button>
    </div>
  );
}
