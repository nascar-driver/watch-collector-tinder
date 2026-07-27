"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/app/state/GameProvider";
import { watches } from "@/app/data/watches";
import { usePreloadImages } from "@/app/lib/usePreloadImages";
import { Logo } from "@/app/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AnimatedMoney } from "@/app/components/game/AnimatedNumber";

/**
 * Budget presets, picked as cards. Rendered in a 3-column grid, so the first
 * three form the top row and the last three the bottom row. Each card shows six
 * strength dots filled by the tier's rank across all budgets — the cheapest
 * budget fills one dot, the priciest fills all six.
 */
const BUDGET_TIERS = [
  {
    value: 500_000,
    name: "Collector",
    display: "$500K",
    blurb: "pick your battles",
  },
  {
    value: 1_000_000,
    name: "Connoisseur",
    display: "$1M",
    blurb: "a serious cellar",
  },
  {
    value: 5_000_000,
    name: "Whale",
    display: "$5M",
    blurb: "taste, not budget",
  },
  {
    value: 25_000,
    name: "Brokie",
    display: "$25K",
    blurb: "ramen budget",
  },
  {
    value: 50_000,
    name: "Hobbyist",
    display: "$50K",
    blurb: "a tasteful start",
  },
  {
    value: 100_000,
    name: "Enthusiast",
    display: "$100K",
    blurb: "a few solid picks",
  },
] as const;

// Ascending order of budgets, used to rank each tier's strength (1 = cheapest,
// BUDGET_TIERS.length = priciest) so the dots read consistently regardless of
// the grid layout above.
const BUDGET_RANK = new Map(
  [...BUDGET_TIERS]
    .sort((a, b) => a.value - b.value)
    .map((tier, index) => [tier.value, index + 1]),
);

export function SetupScreen() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.guest.name);
  const [xHandle, setXHandle] = useState(state.guest.xHandle);
  const [budget, setBudget] = useState<number>(
    state.startingBudget || 1_000_000,
  );

  // Preload the catalogue while the guest fills out the form, so the very
  // first card paints instantly once the game starts.
  usePreloadImages(watches);

  const canStart = name.trim().length > 0 && budget > 0;

  function start() {
    if (!canStart) return;
    dispatch({
      type: "START",
      guest: { name: name.trim(), xHandle: xHandle.trim() },
      budget,
      shuffle: true,
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo size={56} />
        <h1 className="text-gold-gradient mt-6 text-4xl uppercase leading-none sm:text-5xl">
          Collector
          <br />
          Tinder
        </h1>
        <p className="mt-4 max-w-sm text-muted-foreground">
          Build your dream watch collection without going over budget.
        </p>
      </div>

      <Card
        className="w-full max-w-md ring-0"
        style={{
          borderRadius: "2rem",
          background: "var(--background-secondary)",
          backdropFilter: "blur(1.25rem)",
          WebkitBackdropFilter: "blur(1.25rem)",
          padding: "1rem 1.25rem 1.25rem",
        }}
      >
        <CardContent className="p-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              start();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="guest-name">Guest Name</FieldLabel>
                <Input
                  id="guest-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Collector"
                  autoFocus
                  className="h-11 text-base"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="x-handle">X Handle</FieldLabel>
                <Input
                  id="x-handle"
                  value={xHandle}
                  onChange={(e) =>
                    setXHandle(e.target.value.replace(/\s/g, "").slice(0, 20))
                  }
                  maxLength={20}
                  placeholder="@collector"
                  className="h-11 text-base"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="budget">Starting Budget</FieldLabel>

                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_TIERS.map((tier) => {
                    const selected = budget === tier.value;
                    const rank = BUDGET_RANK.get(tier.value) ?? 0;
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setBudget(tier.value)}
                        className={cn(
                          "relative flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center transition-colors",
                          selected
                            ? "border-primary bg-[rgb(248_239_211_/_8%)]"
                            : "border-[rgb(248_239_211_/_12%)] hover:bg-[rgb(248_239_211_/_5%)]",
                        )}
                      >
                        {selected && (
                          <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-3" />
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {tier.name}
                        </span>
                        <span className="text-gold-gradient text-xl leading-none">
                          {tier.display}
                        </span>
                        <span className="flex gap-1">
                          {Array.from({ length: BUDGET_TIERS.length }).map(
                            (_, d) => (
                              <span
                                key={d}
                                className={cn(
                                  "size-1.5 rounded-full",
                                  d < rank
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30",
                                )}
                              />
                            ),
                          )}
                        </span>
                        <span className="text-[11px] leading-tight text-muted-foreground italic">
                          {tier.blurb}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Read-only running total — counts up like the Remaining card */}
                <div
                  id="budget"
                  aria-live="polite"
                  className="relative flex h-14 items-center justify-center rounded-2xl border border-[rgb(248_239_211_/_12%)] bg-[rgb(248_239_211_/_4%)]"
                >
                  <AnimatedMoney
                    value={budget}
                    className="text-gold-gradient text-3xl leading-none tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => setBudget(0)}
                    disabled={budget <= 0}
                    aria-label="Reset budget"
                    className="absolute right-3 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[rgb(248_239_211_/_8%)] hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                </div>
              </Field>

              <Button
                type="submit"
                disabled={!canStart}
                className="mt-2 h-12 text-base"
              >
                Start Game
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
