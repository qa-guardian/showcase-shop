import './style.css';
import { onCartChange, cartCount } from './state/cart';
import { onRouteChange, parseRoute, type Route } from './router';
import { renderCatalog } from './views/catalog';
import { renderCart } from './views/cart';
import { renderCheckout } from './views/checkout';
import { renderConfirmation } from './views/confirmation';
import { renderOrders } from './views/orders';

const main = document.getElementById('main')!;
const cartCountEl = document.getElementById('cart-count')!;

function updateCartBadge(): void {
  cartCountEl.textContent = String(cartCount());
}

function render(route: Route): void {
  switch (route.name) {
    case 'catalog':
      renderCatalog(main);
      break;
    case 'cart':
      renderCart(main);
      break;
    case 'checkout':
      renderCheckout(main);
      break;
    case 'confirmation':
      renderConfirmation(main, route.orderId);
      break;
    case 'orders':
      renderOrders(main);
      break;
  }
  updateCartBadge();
  main.querySelector('h1')?.setAttribute('tabindex', '-1');
  (main.querySelector('h1') as HTMLElement | null)?.focus();
}

function bootstrap(): void {
  let currentRoute: Route = parseRoute(window.location.hash);

  onRouteChange((route) => {
    currentRoute = route;
    render(currentRoute);
  });

  onCartChange(() => {
    updateCartBadge();
    // Cart/checkout totals depend on cart contents; re-render in place so a
    // quantity change or removal is reflected immediately.
    if (currentRoute.name === 'cart' || currentRoute.name === 'checkout') {
      render(currentRoute);
    }
  });
}

bootstrap();
