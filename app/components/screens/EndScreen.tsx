"use client";

import { useState } from "react";
import { useGame } from "@/app/state/GameProvider";
import { remaining } from "@/app/lib/game";
import { encodeResult } from "@/app/lib/share";
import { formatMoney, formatHandle } from "@/app/lib/format";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function EndScreen() {
  const { state, dispatch } = useGame();
  const lost = state.phase === "lost";
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const summary = `I built a ${formatMoney(state.spent)} watch collection (${state.collected.length} watches) on watch.fun!`;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/c/${encodeResult(state)}`
        : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "watch.fun", text: summary, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${summary} ${url}`.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled the share sheet, or it's unsupported — no-op
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center p-4 sm:p-8">
      <header className="flex w-full max-w-4xl items-center justify-between">
        <Logo size={32} withWordmark />
        <div className="text-right text-muted-foreground">
          {state.guest.name}
          {state.guest.xHandle ? (
            <span className="opacity-70"> · {formatHandle(state.guest.xHandle)}</span>
          ) : null}
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

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleShare}
              className="h-12 flex-1 text-base"
            >
              {copied ? "Copied!" : "Share Your Collection"}
            </Button>
            <Button
              variant="ghost"
              disabled
              title="Coming soon"
              className="h-12 flex-1 text-base"
            >
              Download Card
            </Button>
          </div>
          <Button
            onClick={() => dispatch({ type: "RESET" })}
            className="h-12 w-full max-w-sm px-12 text-base"
          >
            Play Again
          </Button>
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
