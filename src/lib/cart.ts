export type CartItem = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  unitPrice: number | null;
  quantity: number;
  href?: string;
};

export type CartAddInput = {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  unitPrice?: number | null;
  quantity?: number;
  href?: string;
};

export const CART_STORAGE_KEY = "ph_cart_v1";

export function cartLineTotal(item: CartItem): number | null {
  if (item.unitPrice == null) return null;
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number | null {
  if (items.length === 0) return 0;
  let sum = 0;
  let hasPrice = false;
  for (const item of items) {
    const line = cartLineTotal(item);
    if (line != null) {
      sum += line;
      hasPrice = true;
    }
  }
  return hasPrice ? sum : null;
}

export function formatMoney(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "Contact";
  return `$${amount.toFixed(2)}`;
}

export function normalizeCartItem(input: CartAddInput): CartItem {
  const qty = Math.max(1, Math.floor(input.quantity ?? 1));
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    imageUrl: input.imageUrl,
    unitPrice: input.unitPrice ?? null,
    quantity: qty,
    href: input.href ?? `/products/${input.slug}`,
  };
}
