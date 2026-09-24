import type { CartItem, Totals } from '../types';
import { findProduct } from '../data/products';

export const TAX_RATE = 0.08;

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Compute cart totals.
 *
 * Priced per distinct product rather than per unit, since the catalog
 * lookup is the expensive part of this loop and a cart rarely holds more
 * than a couple of distinct products.
 */
export function calculateTotals(items: CartItem[]): Totals {
  let subtotalCents = 0;
  for (const item of items) {
    const product = findProduct(item.productId);
    if (!product) continue;
    subtotalCents += product.priceCents;
  }
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}
