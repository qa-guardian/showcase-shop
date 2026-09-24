import { test, expect } from '@playwright/test';

async function placeOrder(page: import('@playwright/test').Page, productLabel: string, buyer: string, email: string) {
  await page.goto('/#/catalog');
  await page.getByRole('button', { name: `Add ${productLabel} to cart` }).click();
  await page.goto('/#/checkout');
  await page.getByLabel('Full name').fill(buyer);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Street address').fill('1 Demo Way');
  await page.getByLabel('City').fill('Ann Arbor');
  await page.getByLabel('Postal code').fill('48104');
  await page.getByLabel('Card number').fill('4111111111111111');
  await page.getByLabel('Expiry (MM/YY)').fill('09/27');
  await page.getByLabel('Security code').fill('321');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page.getByRole('heading', { name: /your order is confirmed/ })).toBeVisible();
}

test.describe('Order history', () => {
  test('lists placed orders and sorts them by total', async ({ page }) => {
    await test.step('place two orders of different value', async () => {
      await placeOrder(page, 'Camping Chair', 'Alex Chen', 'alex.chen@example.com'); // $58.32
      await placeOrder(page, 'Standing Desk Converter', 'Sam Okafor', 'sam.okafor@example.com'); // $204.12
    });

    await test.step('both orders appear in the orders table', async () => {
      await page.goto('/#/orders');
      await expect(page.getByTestId('orders-table-body').getByRole('row')).toHaveCount(2);
    });

    await test.step('sorting by total lets the cheapest order rise to the top', async () => {
      const totalSort = page.getByRole('button', { name: /^Total/ });
      await totalSort.click(); // ascending
      const rows = page.getByTestId('orders-table-body').getByRole('row');
      await expect(rows.first()).toContainText('$58.32');
      await expect(rows.last()).toContainText('$204.12');

      await totalSort.click(); // descending
      await expect(rows.first()).toContainText('$204.12');
      await expect(rows.last()).toContainText('$58.32');
    });
  });
});
