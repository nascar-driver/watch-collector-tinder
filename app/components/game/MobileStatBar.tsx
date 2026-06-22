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
import { CollectionList } from "./CollectionList";

interface MobileStatBarProps {
  budget: number;
  remaining: number;
  spent: number;
  collected: Watch[];
}

/** Compact HUD for mobile: Remaining headline, budget/spent, and a collection drawer. */
export function MobileStatBar({
  budget,
  remaining,
  spent,
  collected,
}: MobileStatBarProps) {
  return (
    <div className="rounded-2xl border bg-card/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Remaining
          </div>
          <div className="text-gold-gradient text-3xl tabular-nums">
            {formatMoney(remaining)}
          </div>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Collected · {collected.length}
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
          <span className="text-foreground/80 tabular-nums">
            {formatMoney(spent)}
          </span>
        </span>
      </div>
    </div>
  );
}
