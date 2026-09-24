export interface Product {
  id: string;
  name: string;
  category: 'Office' | 'Outdoor' | 'Tech';
  priceCents: number;
  sku: string;
  description: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Totals {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export interface OrderLine {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  placedAt: string; // ISO timestamp
  customerName: string;
  email: string;
  lines: OrderLine[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  status: 'Placed';
}
