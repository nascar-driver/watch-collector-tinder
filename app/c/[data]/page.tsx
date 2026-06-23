import type { Metadata } from "next";
import Link from "next/link";
import { decodeResult, hydrateWatches } from "@/app/lib/share";
import { formatMoney, formatHandle } from "@/app/lib/format";
import { cn } from "@/lib/utils";
import { Logo } from "@/app/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ data: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { data } = await params;
  const r = decodeResult(data);
  if (!r) return {}; // fall back to the root metadata

  const name = r.n?.trim() || "A collector";
  const title =
    r.o === "l"
      ? `${name} ruined a ${formatMoney(r.s)} collection`
      : `${name} stacked a ${formatMoney(r.s)} collection`;
  const description = `${r.w.length} watches · ${formatMoney(r.s)} of ${formatMoney(r.b)} spent on watch.fun. Think you can do better?`;

  // og:image / twitter:image are auto-wired from the sibling
  // opengraph-image.tsx / twitter-image.tsx in this route segment.
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedCollectionPage({ params }: PageProps) {
  const { data } = await params;
  const result = decodeResult(data);

  if (!result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <Logo size={40} withWordmark />
        <p className="text-muted-foreground">
          This collection link looks broken or incomplete.
        </p>
        <Button asChild className="h-12 px-12 text-base">
          <Link href="/">Play watch.fun</Link>
        </Button>
      </div>
    );
  }

  const lost = result.o === "l";
  const remaining = result.b - result.s;
  const handle = formatHandle(result.h);
  const name = result.n?.trim() || "A collector";
  const collected = hydrateWatches(result.w);

  return (
    <div className="flex flex-1 flex-col items-center p-4 sm:p-8">
      <header className="flex w-full max-w-4xl items-center justify-between">
        <Logo size={32} withWordmark />
        <div className="text-right text-muted-foreground">
          {name}
          {handle ? <span className="opacity-70"> · {handle}</span> : null}
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
          <Summary label="Budget" value={formatMoney(result.b)} />
          <Summary label="Spent" value={formatMoney(result.s)} />
          <Summary
            label="Remaining"
            value={
              remaining < 0
                ? `-${formatMoney(-remaining)}`
                : formatMoney(remaining)
            }
            accent={remaining >= 0 && !lost}
          />
        </div>

        <Separator className="mt-10" />

        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {lost ? "Watches collected" : "The collection"}
            </span>
            <span className="text-primary tabular-nums">
              {formatMoney(result.s)} · {collected.length} watches
            </span>
          </div>

          {collected.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Walked away empty-handed.
              </CardContent>
            </Card>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {collected.map((w, i) => (
                <li key={`${w.id}-${i}`}>
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

        <div className="mt-10 flex justify-center">
          <Button asChild className="h-12 w-full max-w-sm px-12 text-base">
            <Link href="/">Play your own</Link>
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
