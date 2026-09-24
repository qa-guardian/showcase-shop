import { test, expect } from '@playwright/test';

test.describe('Cart management', () => {
  test('adds items from the catalog, totals them, and updates when an item is removed', async ({ page }) => {
    await test.step('add two products from the catalog', async () => {
      await page.goto('/#/catalog');
      await page.getByRole('button', { name: 'Add Wireless Mouse to cart' }).click();
      await page.getByRole('button', { name: 'Add Insulated Water Bottle to cart' }).click();
      await expect(page.getByTestId('cart-count')).toHaveText('2');
    });

    await test.step('the cart lists both items with correct pricing', async () => {
      await page.goto('/#/cart');
      await expect(page.getByRole('row', { name: /Wireless Mouse/ })).toBeVisible();
      await expect(page.getByRole('row', { name: /Insulated Water Bottle/ })).toBeVisible();
      await expect(page.getByTestId('cart-subtotal')).toHaveText('$43.49');
      await expect(page.getByTestId('cart-tax')).toHaveText('$3.48');
      await expect(page.getByTestId('cart-total')).toHaveText('$46.97');
    });

    await test.step('removing an item recalculates the totals', async () => {
      await page.getByRole('button', { name: 'Remove Insulated Water Bottle from cart' }).click();
      await expect(page.getByRole('row', { name: /Insulated Water Bottle/ })).toHaveCount(0);
      await expect(page.getByTestId('cart-subtotal')).toHaveText('$24.99');
      await expect(page.getByTestId('cart-tax')).toHaveText('$2.00');
      await expect(page.getByTestId('cart-total')).toHaveText('$26.99');
      await expect(page.getByTestId('cart-count')).toHaveText('1');
    });
  });
});
