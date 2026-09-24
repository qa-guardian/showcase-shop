import { test, expect } from '@playwright/test';

test.describe('Checkout validation', () => {
  test('blocks submission with invalid details and completes once every field is valid', async ({ page }) => {
    await test.step('add a product and open checkout', async () => {
      await page.goto('/#/catalog');
      await page.getByRole('button', { name: 'Add Standing Desk Converter to cart' }).click();
      await page.goto('/#/checkout');
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    });

    await test.step('submitting an empty form shows errors and does not place the order', async () => {
      await page.getByRole('button', { name: 'Place order' }).click();
      await expect(page.getByRole('alert')).toContainText('Fix 8 fields before placing your order.');
      await expect(page.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
    });

    await test.step('a complete, valid form places the order', async () => {
      await page.getByLabel('Full name').fill('Jamie Rivera');
      await page.getByLabel('Email').fill('jamie.rivera@example.com');
      await page.getByLabel('Street address').fill('742 Evergreen Terrace');
      await page.getByLabel('City').fill('Springfield');
      await page.getByLabel('Postal code').fill('49007');
      await page.getByLabel('Card number').fill('4111111111111111');
      await page.getByLabel('Expiry (MM/YY)').fill('11/29');
      await page.getByLabel('Security code').fill('123');
      await page.getByRole('button', { name: 'Place order' }).click();

      await expect(page.getByRole('heading', { name: /your order is confirmed/ })).toBeVisible();
      await expect(page.getByTestId('confirmation-total')).toHaveText('$204.12');
    });
  });
});
