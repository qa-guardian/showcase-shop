import { getOrder } from '../state/orders';
import { formatCents } from '../lib/money';

export function renderConfirmation(container: HTMLElement, orderId: string): void {
  const order = getOrder(orderId);

  if (!order) {
    container.innerHTML = `
      <section aria-labelledby="confirmation-heading">
        <h1 id="confirmation-heading">Order not found</h1>
        <p>We couldn't find that order. <a href="#/catalog">Continue shopping</a>.</p>
      </section>
    `;
    return;
  }

  const rows = order.lines
    .map(
      (line) => `
        <tr>
          <th scope="row">${line.name}</th>
          <td>${line.quantity}</td>
          <td>${formatCents(line.unitPriceCents)}</td>
          <td>${formatCents(line.unitPriceCents * line.quantity)}</td>
        </tr>
      `,
    )
    .join('');

  container.innerHTML = `
    <section aria-labelledby="confirmation-heading">
      <h1 id="confirmation-heading">Thanks, ${order.customerName.split(' ')[0] || 'there'} — your order is confirmed</h1>
      <p>Order <strong data-testid="confirmation-order-id">${order.id}</strong> placed on ${new Date(order.placedAt).toLocaleString()}.</p>
      <table>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit price</th>
            <th scope="col">Line total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <dl class="totals" aria-label="Order totals">
        <div><dt>Subtotal</dt><dd data-testid="confirmation-subtotal">${formatCents(order.subtotalCents)}</dd></div>
        <div><dt>Tax</dt><dd data-testid="confirmation-tax">${formatCents(order.taxCents)}</dd></div>
        <div><dt>Total</dt><dd data-testid="confirmation-total">${formatCents(order.totalCents)}</dd></div>
      </dl>
      <p>
        <a href="#/catalog">Back to catalog</a> ·
        <a href="#/orders">View orders</a>
      </p>
    </section>
  `;
}
