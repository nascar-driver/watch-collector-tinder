"use client";

import { useGame } from "@/app/state/GameProvider";
import { remaining } from "@/app/lib/game";
import { formatMoney, formatHandle } from "@/app/lib/format";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/components/brand/Logo";
import { InitialAvatar } from "@/app/components/brand/InitialAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WatchImage } from "@/app/components/game/WatchImage";
import { DownloadCardModal } from "@/app/components/game/DownloadCardModal";

export function EndScreen() {
  const { state, dispatch } = useGame();
  const lost = state.phase === "lost";

  return (
    <div className="flex flex-1 flex-col items-center p-4 sm:p-8">
      <header className="flex w-full max-w-4xl items-center justify-between">
        <Logo size={32} withWordmark />
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="text-right">
            {state.guest.name}
            {state.guest.xHandle ? (
              <span className="opacity-70"> · {formatHandle(state.guest.xHandle)}</span>
            ) : null}
          </div>
          <InitialAvatar name={state.guest.name} size={40} />
        </div>
      </header>

      <div className="mt-8 w-full max-w-4xl">
        <h1
          className={cn(
            "text-center text-4xl uppercase leading-none sm:text-6xl",
            lost ? "text-bust" : "text-gold-gradient",
          )}
        >
          {lost ? "Collection Ruined" : "Collection Complete"}
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
          <Summary label="Budget" value={formatMoney(state.startingBudget)} />
          <Summary label="Spent" value={formatMoney(state.spent)} />
          {!lost && (
            <Summary label="Remaining" value={formatMoney(remaining(state))} accent />
          )}
        </div>

        <Separator className="mt-10" />

        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {lost ? "Watches collected" : "Your collection"}
            </span>
            <span className="text-primary tabular-nums">
              {formatMoney(state.spent)} · {state.collected.length} watches
            </span>
          </div>

          {state.collected.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                You walked away empty-handed.
              </CardContent>
            </Card>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {state.collected.map((w) => (
                <li key={w.id}>
                  <Card size="sm" className="h-full">
                    <CardContent className="flex flex-col gap-1">
                      <div className="mb-2 flex h-24 items-center justify-center">
                        <WatchImage watch={w} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary/70">
                        {w.brand}
                      </span>
                      <span className="truncate text-sm text-foreground/90">
                        {w.model}
                      </span>
                      <Badge
                        variant="outline"
                        className="mt-1 w-fit tabular-nums text-primary"
                      >
                        {formatMoney(w.price)}
                      </Badge>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:mx-auto sm:flex-row">
          <Button
            onClick={() => dispatch({ type: "RESET" })}
            className="h-12 flex-1 text-base"
          >
            Play Again
          </Button>
          <DownloadCardModal
            name={state.guest.name}
            handle={state.guest.xHandle}
            budget={state.startingBudget}
            spent={state.spent}
            collected={state.collected}
            lost={lost}
            triggerClassName="h-12 flex-1 text-base"
          />
        </div>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-4xl tabular-nums",
          accent ? "text-gold-gradient" : "text-foreground/90",
        )}
      >
        {value}
      </div>
    </div>
  );
}
