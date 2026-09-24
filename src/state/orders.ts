import type { Order } from '../types';

const STORAGE_KEY = 'acme-orders/orders';

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Storage unavailable (private mode, quota): order still shows on the
    // confirmation screen for this session, it just won't persist.
  }
}

export function listOrders(): Order[] {
  return readAll();
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function saveOrder(order: Order): void {
  const orders = readAll();
  orders.push(order);
  writeAll(orders);
}
