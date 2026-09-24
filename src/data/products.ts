import type { Product } from '../types';

// Static catalog. No backend: this is the full inventory for the demo.
export const PRODUCTS: Product[] = [
  {
    id: 'mouse-wireless',
    name: 'Wireless Mouse',
    category: 'Tech',
    priceCents: 2499,
    sku: 'ACM-TECH-001',
    description: 'A quiet, reliable wireless mouse for everyday use.',
    inStock: true,
  },
  {
    id: 'desk-converter',
    name: 'Standing Desk Converter',
    category: 'Office',
    priceCents: 18900,
    sku: 'ACM-OFC-014',
    description: 'Sit-to-stand converter that fits on top of any desk.',
    inStock: true,
  },
  {
    id: 'water-bottle',
    name: 'Insulated Water Bottle',
    category: 'Outdoor',
    priceCents: 1850,
    sku: 'ACM-OUT-007',
    description: 'Keeps drinks cold for 24 hours or hot for 12.',
    inStock: true,
  },
  {
    id: 'keyboard-mechanical',
    name: 'Mechanical Keyboard',
    category: 'Tech',
    priceCents: 7900,
    sku: 'ACM-TECH-002',
    description: 'Tactile switches with a compact, no-numpad layout.',
    inStock: true,
  },
  {
    id: 'desk-lamp',
    name: 'Desk Lamp',
    category: 'Office',
    priceCents: 3425,
    sku: 'ACM-OFC-021',
    description: 'Dimmable LED desk lamp with a USB charging port.',
    inStock: false,
  },
  {
    id: 'camping-chair',
    name: 'Camping Chair',
    category: 'Outdoor',
    priceCents: 5400,
    sku: 'ACM-OUT-011',
    description: 'Folding chair with a built-in cup holder and carry bag.',
    inStock: true,
  },
];

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
