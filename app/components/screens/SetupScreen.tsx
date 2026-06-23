"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/app/state/GameProvider";
import { Logo } from "@/app/components/brand/Logo";
import { formatMoney } from "@/app/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

/** Headline budget tiers, picked as cards (like preset chips). */
const BUDGET_TIERS = [
  {
    value: 25000,
    name: "Bargain",
    display: "$25K",
    blurb: "hunt for hidden gems",
  },
  {
    value: 50000,
    name: "Enthusiast",
    display: "$50K",
    blurb: "a balanced cellar",
  },
  {
    value: 100000,
    name: "Whale",
    display: "$100K",
    blurb: "buy what moves you",
  },
] as const;

/** Quick-add increments for fine-tuning the custom budget. */
const BUDGET_STEPS = [1000, 10000, 100000];

export function SetupScreen() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.guest.name);
  const [xHandle, setXHandle] = useState(state.guest.xHandle);
  const [budget, setBudget] = useState<number>(state.startingBudget || 50000);
  // Which tier card is "focused". Sticky: only changes when a card is picked,
  // not when the amount is incremented or typed.
  const [selectedTier, setSelectedTier] = useState<number | null>(() => {
    const initial = state.startingBudget || 50000;
    return BUDGET_TIERS.some((t) => t.value === initial) ? initial : null;
  });

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
                  placeholder="Jane Collector"
                  autoFocus
                  className="h-11 text-base"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="x-handle">X Handle</FieldLabel>
                <Input
                  id="x-handle"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  placeholder="@janecollector"
                  className="h-11 text-base"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="budget">Starting Budget</FieldLabel>

                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_TIERS.map((tier, i) => {
                    const selected = selectedTier === tier.value;
                    return (
                      <button
                        key={tier.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setSelectedTier(tier.value);
                          setBudget(tier.value);
                        }}
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
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className={cn(
                                "size-1.5 rounded-full",
                                d <= i
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30",
                              )}
                            />
                          ))}
                        </span>
                        <span className="text-[11px] leading-tight text-muted-foreground italic">
                          {tier.blurb}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <InputGroup className="h-11">
                  <InputGroupAddon>
                    <InputGroupText className="text-primary">$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="budget"
                    type="number"
                    min={1}
                    value={budget || ""}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="text-base tabular-nums"
                  />
                </InputGroup>

                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_STEPS.map((step) => (
                    <Button
                      key={step}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBudget((b) => (b || 0) + step)}
                      className="border-[rgb(248_239_211_/_12%)] bg-transparent hover:bg-[rgb(248_239_211_/_8%)]"
                    >
                      +{formatMoney(step)}
                    </Button>
                  ))}
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
