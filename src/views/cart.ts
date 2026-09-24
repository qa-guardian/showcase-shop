import { findProduct } from '../data/products';
import { getCartItems, removeFromCart, setQuantity } from '../state/cart';
import { calculateTotals, formatCents } from '../lib/money';

export function renderCart(container: HTMLElement): void {
  const items = getCartItems();

  if (items.length === 0) {
    container.innerHTML = `
      <section aria-labelledby="cart-heading">
        <h1 id="cart-heading">Your cart</h1>
        <p>Your cart is empty. <a href="#/catalog">Continue shopping</a>.</p>
      </section>
    `;
    return;
  }

  const rows = items
    .map((item) => {
      const product = findProduct(item.productId);
      if (!product) return '';
      const lineTotal = product.priceCents * item.quantity;
      return `
        <tr data-testid="cart-row-${product.id}">
          <th scope="row">${product.name}</th>
          <td>${formatCents(product.priceCents)}</td>
          <td>
            <label for="qty-${product.id}">Quantity for ${product.name}</label>
            <input id="qty-${product.id}" type="number" min="1" value="${item.quantity}" data-product-id="${product.id}" class="qty-input" />
          </td>
          <td data-testid="line-total-${product.id}">${formatCents(lineTotal)}</td>
          <td><button type="button" aria-label="Remove ${product.name} from cart">Remove</button></td>
        </tr>
      `;
    })
    .join('');

  const totals = calculateTotals(items);

  container.innerHTML = `
    <section aria-labelledby="cart-heading">
      <h1 id="cart-heading">Your cart</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Quantity</th>
            <th scope="col">Line total</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <dl class="totals" aria-label="Order totals">
        <div><dt>Subtotal</dt><dd data-testid="cart-subtotal">${formatCents(totals.subtotalCents)}</dd></div>
        <div><dt>Tax</dt><dd data-testid="cart-tax">${formatCents(totals.taxCents)}</dd></div>
        <div><dt>Total</dt><dd data-testid="cart-total">${formatCents(totals.totalCents)}</dd></div>
      </dl>
      <a href="#/checkout" role="button" class="button-primary">Proceed to checkout</a>
    </section>
  `;

  container.querySelectorAll<HTMLButtonElement>('button[aria-label^="Remove"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest<HTMLElement>('[data-testid^="cart-row-"]')!;
      const productId = row.dataset.testid!.replace('cart-row-', '');
      removeFromCart(productId);
    });
  });

  container.querySelectorAll<HTMLInputElement>('.qty-input').forEach((input) => {
    input.addEventListener('change', () => {
      const productId = input.dataset.productId!;
      const value = Math.max(1, Math.floor(Number(input.value) || 1));
      setQuantity(productId, value);
    });
  });
}
