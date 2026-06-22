import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ControlBarProps {
  onPass: () => void;
  onBuy: () => void;
  onCashOut: () => void;
  disabled?: boolean;
}

const SIZE =
  "h-12 flex-1 rounded-full px-6 text-sm lg:h-14 lg:flex-none lg:px-12 lg:text-base";

export function ControlBar({ onPass, onBuy, onCashOut, disabled }: ControlBarProps) {
  return (
    <div className="flex items-center justify-center gap-3 lg:gap-4">
      <Button
        variant="pass"
        onClick={onPass}
        disabled={disabled}
        className={SIZE}
        aria-label="Pass on this watch (left arrow)"
      >
        Pass
      </Button>
      <Button
        variant="buy"
        onClick={onBuy}
        disabled={disabled}
        className={cn(SIZE, "shadow-[0_10px_30px_-8px_rgba(31,191,117,0.6)]")}
        aria-label="Buy this watch (right arrow or space)"
      >
        Buy
      </Button>
      <Button
        variant="outline"
        onClick={onCashOut}
        disabled={disabled}
        className={cn(
          SIZE,
          "border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        )}
        aria-label="Cash out and end the game (escape)"
      >
        Cash Out
      </Button>
    </div>
  );
}
