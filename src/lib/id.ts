// Deliberately not crypto.randomUUID(): that API only exists in secure
// contexts (HTTPS, or http://localhost). Acme Orders is meant to be
// reachable over plain HTTP under an arbitrary hostname (a Docker network
// alias for CI-gate rehearsals, a bare internal domain, GitHub Pages is
// HTTPS but not every host is) — an order id is display-only, not a
// security token, so a plain PRNG is the right tool and works everywhere.
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function randomId(length = 8): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}
