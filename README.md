# Acme Orders

A tiny shop tested by QA Guardian. Every pull request against this repo is
checked by the QA Guardian release gate before it can merge.

[![playwright-score](https://img.shields.io/npm/v/@qaguardian/playwright-score?label=playwright-score)](https://www.npmjs.com/package/@qaguardian/playwright-score)

Acme Orders is a small, honest, login-free sample storefront. It's not a
real product and collects nothing: no backend, no analytics, no external
calls. All state lives in the browser (in-memory cart, `localStorage` order
history).

**Journeys:** browse/search/filter a small catalog → add to cart → checkout
with validated fields → order confirmation → order history with sorting.

Built by [QA Guardian](https://qaguardian.com) — managed QA that authors,
runs, and triages your Playwright suite, and gates your pull requests on
it.

## Run it

Static front end, plain Vite + TypeScript, no framework, two dependencies
(`vite`, `typescript`, both dev-only — nothing ships to the browser but the
app's own code).

```sh
npm install
npm run build      # -> dist/, deployable as-is (GitHub Pages, any static host)
npm run preview    # serve dist/ locally at :4173, for a quick look
```

## The Guardian suite (`e2e/guardian/`)

Laid out for QA Guardian's repo-native test-source import — each top-level
directory under `specs/` becomes one **Flow**, and each spec file inside it
becomes one **Test**.

| Flow | Spec | Journey |
|---|---|---|
| `catalog-search` | `filter-products.spec.ts` | Search + category filter, incl. empty state |
| `cart` | `manage-cart.spec.ts` | Add/remove items, running totals |
| `checkout` | `checkout-validation.spec.ts` | Required-field validation, then a valid submission |
| `checkout` | `checkout-totals.spec.ts` | Multi-quantity pricing |
| `orders` | `orders-history.spec.ts` | Order history list + sort-by-total |

Locators are role/label/test-id throughout (real accessible names first;
`data-testid` only for non-interactive value displays with no natural
role, e.g. `cart-subtotal`), assertions are web-first
(`expect(locator).toHave*`, never a manual poll), there are no hard waits,
and each test gets a fresh browser context.

### Run for real, with the official Playwright image

```sh
# 1. serve the app (npm run preview), then, from e2e/guardian/:
docker run --rm --network host \
  -v "$(pwd)":/work -w /work -e BASE_URL=http://localhost:4173 \
  mcr.microsoft.com/playwright:v1.48.0-focal \
  bash -c "npm install && npx playwright test --reporter=list"
```

## The CI gate (`.github/workflows/guardian-gate.yml`)

Runs the suite above through the `qaguardian` CLI on every pull request, at
the PR head commit, and posts a commit status named **Guardian release
gate**. It needs one repository secret, `QAGUARDIAN_API_KEY`; without it
the workflow no-ops instead of failing.

This workflow calls out to QA Guardian's hosted infrastructure from a
GitHub-hosted runner — it does not reach a private or local QA Guardian
install. A local install triggers runs against this app with the same
`qaguardian` CLI, invoked directly rather than through this workflow.

## Layout

```
src/                 app source (TypeScript, no framework)
e2e/guardian/         Playwright suite, repo-native import layout
.github/workflows/   CI: Guardian gate (PRs) + Pages deploy (main)
```

## License

MIT — see [LICENSE](LICENSE).
