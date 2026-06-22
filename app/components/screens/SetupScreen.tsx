"use client";

import { useState } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const BUDGET_PRESETS = [25000, 50000, 100000];

export function SetupScreen() {
  const { state, dispatch } = useGame();
  const [name, setName] = useState(state.guest.name);
  const [xHandle, setXHandle] = useState(state.guest.xHandle);
  const [budget, setBudget] = useState<number>(state.startingBudget || 50000);

  const canStart = name.trim().length > 0 && budget > 0;
  const presetValue = BUDGET_PRESETS.includes(budget) ? String(budget) : "";

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

      <Card className="w-full max-w-md">
        <CardContent>
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
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={presetValue}
                  onValueChange={(v) => {
                    if (v) setBudget(Number(v));
                  }}
                  className="mt-1 w-full"
                >
                  {BUDGET_PRESETS.map((p) => (
                    <ToggleGroupItem key={p} value={String(p)} className="flex-1">
                      {formatMoney(p)}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
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
