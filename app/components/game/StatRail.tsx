import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/app/lib/format";

interface StatRailProps {
  budget: number;
  remaining: number;
  spent: number;
}

function Stat({
  label,
  value,
  reserveCh,
  accent,
}: {
  label: string;
  value: string;
  /** Reserve width (in ch) for the widest possible figure, so the card never reflows. */
  reserveCh: number;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div
        style={{ minWidth: `${reserveCh}ch` }}
        className={cn(
          "mt-1 whitespace-nowrap tabular-nums",
          accent ? "text-gold-gradient text-4xl" : "text-2xl text-foreground/90",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function StatRail({ budget, remaining, spent }: StatRailProps) {
  // The largest figure shown is always the starting budget (remaining/spent ≤ budget).
  // Reserve that width so the card stays a stable size for the whole game.
  const reserveCh = formatMoney(budget).length;

  return (
    <Card className="w-fit min-w-56">
      <CardContent className="flex flex-col gap-7 py-2">
        <Stat
          label="Remaining"
          value={formatMoney(remaining)}
          reserveCh={reserveCh}
          accent
        />
        <Stat label="Budget" value={formatMoney(budget)} reserveCh={reserveCh} />
        <Stat label="Spent" value={formatMoney(spent)} reserveCh={reserveCh} />
      </CardContent>
    </Card>
  );
}
