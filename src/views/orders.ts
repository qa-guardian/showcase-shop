import { listOrders } from '../state/orders';
import { formatCents } from '../lib/money';
import type { Order } from '../types';

type SortKey = 'placedAt' | 'totalCents';
type SortDirection = 'ascending' | 'descending';

let sortKey: SortKey = 'placedAt';
let sortDirection: SortDirection = 'descending';

function sortOrders(orders: Order[]): Order[] {
  const factor = sortDirection === 'ascending' ? 1 : -1;
  return [...orders].sort((a, b) => {
    if (sortKey === 'placedAt') {
      return (new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime()) * factor;
    }
    return (a.totalCents - b.totalCents) * factor;
  });
}

export function renderOrders(container: HTMLElement): void {
  const orders = listOrders();

  if (orders.length === 0) {
    container.innerHTML = `
      <section aria-labelledby="orders-heading">
        <h1 id="orders-heading">Your orders</h1>
        <p>No orders yet. <a href="#/catalog">Start shopping</a>.</p>
      </section>
    `;
    return;
  }

  function draw(): void {
    const sorted = sortOrders(orders);
    const rows = sorted
      .map(
        (order) => `
          <tr data-testid="order-row-${order.id}">
            <th scope="row">${order.id}</th>
            <td>${new Date(order.placedAt).toLocaleString()}</td>
            <td>${order.lines.reduce((n, l) => n + l.quantity, 0)}</td>
            <td>${formatCents(order.totalCents)}</td>
            <td>${order.status}</td>
          </tr>
        `,
      )
      .join('');

    const dateSort = sortKey === 'placedAt' ? sortDirection : 'none';
    const totalSort = sortKey === 'totalCents' ? sortDirection : 'none';

    container.innerHTML = `
      <section aria-labelledby="orders-heading">
        <h1 id="orders-heading">Your orders</h1>
        <table>
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col" aria-sort="${dateSort}">
                <button type="button" data-sort="placedAt">Date ${dateSort === 'ascending' ? '▲' : dateSort === 'descending' ? '▼' : ''}</button>
              </th>
              <th scope="col">Items</th>
              <th scope="col" aria-sort="${totalSort}">
                <button type="button" data-sort="totalCents">Total ${totalSort === 'ascending' ? '▲' : totalSort === 'descending' ? '▼' : ''}</button>
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody data-testid="orders-table-body">${rows}</tbody>
        </table>
      </section>
    `;

    container.querySelectorAll<HTMLButtonElement>('button[data-sort]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sort as SortKey;
        if (sortKey === key) {
          sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
        } else {
          sortKey = key;
          sortDirection = 'ascending';
        }
        draw();
      });
    });
  }

  draw();
}
