export function toDateString(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateString(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(dt: Date): boolean {
  return isSameDay(dt, new Date());
}

/** SQLiteのUTCタイムスタンプをJST Dateに変換 */
export function parseUtcTimestamp(s: string): Date {
  // "2026-04-19 06:17:20" → "2026-04-19T06:17:20Z"
  return new Date(s.replace(" ", "T") + (s.includes("Z") ? "" : "Z"));
}

export function formatJstTime(s: string): string {
  return parseUtcTimestamp(s).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatJstDateTime(s: string): string {
  return parseUtcTimestamp(s).toLocaleString("ja-JP");
}
