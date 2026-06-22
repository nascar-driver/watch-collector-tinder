/** Format a number as whole-dollar USD, e.g. 18000 -> "$18,000". */
export function formatMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/** Normalize an X handle to "@name" (empty stays empty). */
export function formatHandle(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : "@" + trimmed;
}
