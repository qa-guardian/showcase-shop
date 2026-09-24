import { test, expect } from '@playwright/test';

// Multi-quantity pricing: buying 3x the same item must multiply the unit
// price by quantity, not just charge for one unit (see src/lib/money.ts).
test.describe('Checkout totals reflect quantity', () => {
  test('a multi-quantity line item is priced correctly through checkout and on the confirmation page', async ({ page }) => {
    await test.step('add the same product three times', async () => {
      await page.goto('/#/catalog');
      const addToCart = page.getByRole('button', { name: 'Add Wireless Mouse to cart' });
      await addToCart.click();
      await addToCart.click();
      await addToCart.click();
      await expect(page.getByTestId('cart-count')).toHaveText('3');
    });

    await test.step('checkout totals multiply unit price by quantity', async () => {
      await page.goto('/#/checkout');
      await expect(page.getByText('Wireless Mouse × 3')).toBeVisible();
      await expect(page.getByTestId('checkout-subtotal')).toHaveText('$74.97');
      await expect(page.getByTestId('checkout-tax')).toHaveText('$6.00');
      await expect(page.getByTestId('checkout-total')).toHaveText('$80.97');
    });

    await test.step('the confirmed order keeps the same, correct total', async () => {
      await page.getByLabel('Full name').fill('Morgan Lee');
      await page.getByLabel('Email').fill('morgan.lee@example.com');
      await page.getByLabel('Street address').fill('12 Ocean Avenue');
      await page.getByLabel('City').fill('Portland');
      await page.getByLabel('Postal code').fill('97201');
      await page.getByLabel('Card number').fill('4242424242424242');
      await page.getByLabel('Expiry (MM/YY)').fill('06/28');
      await page.getByLabel('Security code').fill('456');
      await page.getByRole('button', { name: 'Place order' }).click();

      await expect(page.getByTestId('confirmation-total')).toHaveText('$80.97');
    });
  });
});
