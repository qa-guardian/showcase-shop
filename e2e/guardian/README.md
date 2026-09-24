# Acme Orders — Guardian suite

Playwright flows for the Acme Orders demo app, laid out the way QA
Guardian's repo-native test-source import expects:

```
specs/<flow-name>/*.spec.ts   one folder per flow, plain @playwright/test
playwright.config.ts          local run config (testDir: ./specs)
.env.example                  variable names to fill in for a local run
```

## Flows

| Flow (directory) | Spec | Journey |
|---|---|---|
| `catalog-search` | `filter-products.spec.ts` | Search and category filtering, including the empty-results state |
| `cart` | `manage-cart.spec.ts` | Add/remove items, running totals |
| `checkout` | `checkout-validation.spec.ts` | Required-field validation, then a valid submission |
| `checkout` | `checkout-totals.spec.ts` | Multi-quantity pricing through checkout and confirmation |
| `orders` | `orders-history.spec.ts` | Order history list and sort-by-total |

## Run locally

```sh
npm install
npx playwright test              # needs the app running — see repo root README
```

Run a single flow: `npx playwright test specs/checkout/`

## Scores

See the repo root `README.md` for `@qaguardian/playwright-score` results per
spec.
