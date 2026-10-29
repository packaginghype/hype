/**
 * Combines CSS class names filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format currency or price string
 */
export function formatPrice(price?: number | string | null): string {
  if (price === null || price === undefined || price === "" || Number(price) === 0) {
    return "Contact for Quote";
  }
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "Contact for Quote";
  return `$${num.toFixed(2)}`;
}

/**
 * Generates an accessible unique ID
 */
export function openDatePicker(
  event: { currentTarget: HTMLInputElement }
) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    /* Already open or unsupported */
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
