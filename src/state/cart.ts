import type { CartItem } from '../types';

// In-memory cart. Deliberately not persisted: reloading the tab starts a
// fresh cart, same as most storefronts' guest-cart behaviour on hard refresh
// would feel to a user testing on a clean profile. Order history (state/orders.ts)
// is what persists.
let items: CartItem[] = [];
const listeners = new Set<() => void>();

function notify(): void {
  for (const l of listeners) l();
}

export function onCartChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartItems(): CartItem[] {
  return items.map((i) => ({ ...i }));
}

export function cartCount(): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function addToCart(productId: string, quantity = 1): void {
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  notify();
}

export function setQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const existing = items.find((i) => i.productId === productId);
  if (existing) existing.quantity = quantity;
  notify();
}

export function removeFromCart(productId: string): void {
  items = items.filter((i) => i.productId !== productId);
  notify();
}

export function clearCart(): void {
  items = [];
  notify();
}
