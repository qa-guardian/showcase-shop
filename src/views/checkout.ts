import { findProduct } from '../data/products';
import { getCartItems, clearCart } from '../state/cart';
import { calculateTotals, formatCents } from '../lib/money';
import { saveOrder } from '../state/orders';
import type { CustomerDetails, Order, OrderLine } from '../types';
import { navigate } from '../router';
import { randomId } from '../lib/id';

interface FieldRule {
  name: keyof CustomerDetails;
  label: string;
  test: (value: string) => boolean;
  message: string;
  autocomplete?: string;
  inputMode?: string;
}

const FIELDS: FieldRule[] = [
  { name: 'fullName', label: 'Full name', test: (v) => v.trim().length > 0, message: 'Enter your full name.', autocomplete: 'name' },
  {
    name: 'email',
    label: 'Email',
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Enter a valid email address.',
    autocomplete: 'email',
  },
  { name: 'address', label: 'Street address', test: (v) => v.trim().length > 0, message: 'Enter your street address.', autocomplete: 'street-address' },
  { name: 'city', label: 'City', test: (v) => v.trim().length > 0, message: 'Enter your city.', autocomplete: 'address-level2' },
  {
    name: 'postalCode',
    label: 'Postal code',
    test: (v) => /^[A-Za-z0-9 -]{3,10}$/.test(v.trim()),
    message: 'Enter a valid postal code.',
    autocomplete: 'postal-code',
  },
  {
    name: 'cardNumber',
    label: 'Card number',
    test: (v) => /^\d{16}$/.test(v.replace(/\s+/g, '')),
    message: 'Enter a 16-digit card number.',
    autocomplete: 'cc-number',
    inputMode: 'numeric',
  },
  {
    name: 'expiry',
    label: 'Expiry (MM/YY)',
    test: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()),
    message: 'Enter expiry as MM/YY.',
    autocomplete: 'cc-exp',
  },
  {
    name: 'cvc',
    label: 'Security code',
    test: (v) => /^\d{3,4}$/.test(v.trim()),
    message: 'Enter a 3 or 4 digit security code.',
    autocomplete: 'cc-csc',
    inputMode: 'numeric',
  },
];

function orderLinesFromCart(): OrderLine[] {
  return getCartItems()
    .map((item) => {
      const product = findProduct(item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
      };
    })
    .filter((l): l is OrderLine => l !== null);
}

export function renderCheckout(container: HTMLElement): void {
  const items = getCartItems();

  if (items.length === 0) {
    container.innerHTML = `
      <section aria-labelledby="checkout-heading">
        <h1 id="checkout-heading">Checkout</h1>
        <p>Your cart is empty. <a href="#/catalog">Continue shopping</a>.</p>
      </section>
    `;
    return;
  }

  const totals = calculateTotals(items);

  container.innerHTML = `
    <section aria-labelledby="checkout-heading" class="checkout-layout">
      <div>
        <h1 id="checkout-heading">Checkout</h1>
        <div id="form-errors" role="alert" aria-live="assertive"></div>
        <form id="checkout-form" novalidate>
          ${FIELDS.map(
            (f) => `
            <div class="field">
              <label for="field-${f.name}">${f.label}</label>
              <input
                id="field-${f.name}"
                name="${f.name}"
                type="text"
                ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''}
                ${f.inputMode ? `inputmode="${f.inputMode}"` : ''}
                aria-describedby="error-${f.name}"
              />
              <p id="error-${f.name}" class="field-error"></p>
            </div>
          `,
          ).join('')}
          <button type="submit">Place order</button>
        </form>
      </div>
      <aside aria-labelledby="summary-heading">
        <h2 id="summary-heading">Order summary</h2>
        <ul>
          ${items
            .map((item) => {
              const product = findProduct(item.productId)!;
              return `<li>${product.name} × ${item.quantity}</li>`;
            })
            .join('')}
        </ul>
        <dl class="totals" aria-label="Order totals">
          <div><dt>Subtotal</dt><dd data-testid="checkout-subtotal">${formatCents(totals.subtotalCents)}</dd></div>
          <div><dt>Tax</dt><dd data-testid="checkout-tax">${formatCents(totals.taxCents)}</dd></div>
          <div><dt>Total</dt><dd data-testid="checkout-total">${formatCents(totals.totalCents)}</dd></div>
        </dl>
      </aside>
    </section>
  `;

  const form = container.querySelector<HTMLFormElement>('#checkout-form')!;
  const errorBanner = container.querySelector<HTMLDivElement>('#form-errors')!;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const invalidFields: FieldRule[] = [];

    for (const field of FIELDS) {
      const value = String(data.get(field.name) ?? '');
      const input = container.querySelector<HTMLInputElement>(`#field-${field.name}`)!;
      const errorEl = container.querySelector<HTMLParagraphElement>(`#error-${field.name}`)!;
      const valid = field.test(value);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      errorEl.textContent = valid ? '' : field.message;
      if (!valid) invalidFields.push(field);
    }

    if (invalidFields.length > 0) {
      errorBanner.textContent = `Fix ${invalidFields.length} field${invalidFields.length === 1 ? '' : 's'} before placing your order.`;
      container.querySelector<HTMLInputElement>(`#field-${invalidFields[0].name}`)!.focus();
      return;
    }

    errorBanner.textContent = '';
    const customer: CustomerDetails = Object.fromEntries(
      FIELDS.map((f) => [f.name, String(data.get(f.name) ?? '')]),
    ) as unknown as CustomerDetails;

    const finalTotals = calculateTotals(getCartItems());
    const order: Order = {
      id: `ORD-${randomId(8)}`,
      placedAt: new Date().toISOString(),
      customerName: customer.fullName,
      email: customer.email,
      lines: orderLinesFromCart(),
      subtotalCents: finalTotals.subtotalCents,
      taxCents: finalTotals.taxCents,
      totalCents: finalTotals.totalCents,
      status: 'Placed',
    };

    saveOrder(order);
    clearCart();
    navigate(`/confirmation/${order.id}`);
  });
}
