export type Route =
  | { name: 'catalog' }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'confirmation'; orderId: string }
  | { name: 'orders' };

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/catalog';
  const confirmationMatch = path.match(/^\/confirmation\/([^/]+)$/);
  if (confirmationMatch) return { name: 'confirmation', orderId: decodeURIComponent(confirmationMatch[1]) };
  if (path === '/cart') return { name: 'cart' };
  if (path === '/checkout') return { name: 'checkout' };
  if (path === '/orders') return { name: 'orders' };
  return { name: 'catalog' };
}

export function navigate(path: string): void {
  window.location.hash = path;
}

export function onRouteChange(listener: (route: Route) => void): void {
  const handler = () => listener(parseRoute(window.location.hash));
  window.addEventListener('hashchange', handler);
  handler();
}
