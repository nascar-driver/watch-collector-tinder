import { cn } from "@/lib/utils";
import { initials } from "@/app/lib/format";

/**
 * Circular initials avatar — uses the Download button's surface treatment
 * (background-secondary + foreground text). Decorative; pair with the name
 * as visible text, hence aria-hidden.
 */
export function InitialAvatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-[rgb(248_239_211_/_12%)] font-medium uppercase leading-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        background: "var(--background-secondary)",
        color: "var(--foreground)",
      }}
    >
      {initials(name)}
    </span>
  );
}
