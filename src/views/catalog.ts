import { PRODUCTS } from '../data/products';
import { addToCart } from '../state/cart';
import { formatCents } from '../lib/money';
import type { Product } from '../types';

const CATEGORIES = ['All categories', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

function matches(product: Product, query: string, category: string): boolean {
  const inCategory = category === 'All categories' || product.category === category;
  const q = query.trim().toLowerCase();
  const inQuery = q === '' || product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
  return inCategory && inQuery;
}

function productCard(product: Product): string {
  return `
    <li class="product-card" data-testid="product-card-${product.id}">
      <h3>${product.name}</h3>
      <p class="product-card__category">${product.category}</p>
      <p class="product-card__description">${product.description}</p>
      <p class="product-card__price">${formatCents(product.priceCents)}</p>
      ${
        product.inStock
          ? `<button type="button" aria-label="Add ${product.name} to cart">Add to cart</button>`
          : `<p class="product-card__oos" role="status">Out of stock</p>
             <button type="button" aria-label="Add ${product.name} to cart" disabled>Add to cart</button>`
      }
    </li>
  `;
}

export function renderCatalog(container: HTMLElement): void {
  container.innerHTML = `
    <section aria-labelledby="catalog-heading">
      <h1 id="catalog-heading">Shop Acme Orders</h1>
      <div class="catalog-controls">
        <label for="product-search">Search products</label>
        <input id="product-search" type="search" placeholder="e.g. keyboard" />
        <label for="category-filter">Filter by category</label>
        <select id="category-filter">
          ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <p id="results-count" role="status" aria-live="polite"></p>
      <ul class="product-grid" id="product-grid" data-testid="product-grid"></ul>
    </section>
  `;

  const searchInput = container.querySelector<HTMLInputElement>('#product-search')!;
  const categorySelect = container.querySelector<HTMLSelectElement>('#category-filter')!;
  const grid = container.querySelector<HTMLUListElement>('#product-grid')!;
  const resultsCount = container.querySelector<HTMLParagraphElement>('#results-count')!;

  function renderList(): void {
    const query = searchInput.value;
    const category = categorySelect.value;
    const visible = PRODUCTS.filter((p) => matches(p, query, category));
    grid.innerHTML = visible.length
      ? visible.map(productCard).join('')
      : '';
    resultsCount.textContent = visible.length
      ? `${visible.length} product${visible.length === 1 ? '' : 's'}`
      : 'No products match your search.';

    grid.querySelectorAll<HTMLButtonElement>('button:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest<HTMLElement>('[data-testid^="product-card-"]')!;
        const productId = card.dataset.testid!.replace('product-card-', '');
        addToCart(productId, 1);
        btn.textContent = 'Added';
        setTimeout(() => {
          btn.textContent = 'Add to cart';
        }, 800);
      });
    });
  }

  searchInput.addEventListener('input', renderList);
  categorySelect.addEventListener('change', renderList);
  renderList();
}
