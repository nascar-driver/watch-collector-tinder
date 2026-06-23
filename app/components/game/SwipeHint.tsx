import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Clean play instruction shown where the action buttons used to be.
 */
export function SwipeHint() {
  return (
    <div className="flex items-center justify-center gap-4 text-sm tracking-[0.02em] text-muted-foreground sm:gap-6">
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-sm border border-current">
          <ArrowLeft className="size-4" />
        </span>
        Swipe left to <span className="font-bold">PASS</span>
      </span>
      <span className="hidden h-4 w-px bg-line sm:block" />
      <span className="inline-flex items-center gap-2">
        Swipe right to <span className="font-bold">BUY</span>
        <span className="inline-flex size-8 items-center justify-center rounded-sm border border-current">
          <ArrowRight className="size-4" />
        </span>
      </span>
    </div>
  );
}
