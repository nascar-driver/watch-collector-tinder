import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Watch } from "@/app/lib/types";
import { AnimatedCount, AnimatedMoney } from "./AnimatedNumber";
import { CollectionList } from "./CollectionList";

interface CollectionRailProps {
  collected: Watch[];
  value: number;
}

export function CollectionRail({ collected, value }: CollectionRailProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Collected
        </CardTitle>
        <CardAction>
          <Badge variant="secondary" className="text-sm tabular-nums">
            <AnimatedCount value={collected.length} />
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        <CollectionList collected={collected} />
      </CardContent>

      <CardFooter className="flex-col items-start gap-1">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Collection value
        </div>
        <AnimatedMoney
          value={value}
          className="text-gold-gradient text-3xl tabular-nums"
        />
      </CardFooter>
    </Card>
  );
}
