/** Format a number as whole-dollar USD, e.g. 18000 -> "$18,000". */
export function formatMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/**
 * Initials from a name, max two letters.
 * "Alice Ferguson" -> "AF", "Alice" -> "A", "" -> "".
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Normalize an X handle to "@name" (empty stays empty). */
export function formatHandle(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : "@" + trimmed;
}
