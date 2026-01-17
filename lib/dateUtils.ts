/**
 * Format a timestamp (milliseconds) to a localized date string
 * @param timestamp - Milliseconds since epoch
 * @param locale - Locale string (default: 'ar-SD' for Arabic Sudan)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  timestamp: number,
  locale: string = "ar-SD",
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(timestamp).toLocaleDateString(
    locale,
    options || defaultOptions,
  );
}

/**
 * Format a timestamp to a short date string (no time)
 * @param timestamp - Milliseconds since epoch
 * @param locale - Locale string (default: 'ar-EG' for Arabic Egypt)
 * @returns Formatted date string
 */
export function formatDateShort(
  timestamp: number,
  locale: string = "ar-EG",
): string {
  return new Date(timestamp).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a timestamp to a relative time string (e.g., "2 hours ago")
 * @param timestamp - Milliseconds since epoch
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
  if (hours > 0) return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
  if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? "دقيقة" : "دقائق"}`;
  return "الآن";
}
