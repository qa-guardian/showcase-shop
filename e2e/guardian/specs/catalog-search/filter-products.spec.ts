import { test, expect } from '@playwright/test';

test.describe('Catalog search and filtering', () => {
  test('narrows the catalog by search text and category, and shows an empty state for no matches', async ({ page }) => {
    await test.step('open the catalog', async () => {
      await page.goto('/#/catalog');
      await expect(page.getByRole('heading', { name: 'Shop Acme Orders' })).toBeVisible();
    });

    const grid = page.getByTestId('product-grid');
    const search = page.getByLabel('Search products');
    const categoryFilter = page.getByLabel('Filter by category');

    await test.step('search narrows results to matching products', async () => {
      await search.fill('keyboard');
      await expect(grid.getByRole('listitem')).toHaveCount(1);
      await expect(grid.getByRole('heading', { name: 'Mechanical Keyboard' })).toBeVisible();
    });

    await test.step('category filter narrows results independently of search', async () => {
      await search.fill('');
      await categoryFilter.selectOption('Outdoor');
      await expect(grid.getByRole('listitem')).toHaveCount(2);
      await expect(grid.getByRole('heading', { name: 'Insulated Water Bottle' })).toBeVisible();
      await expect(grid.getByRole('heading', { name: 'Camping Chair' })).toBeVisible();
      await expect(grid.getByRole('heading', { name: 'Mechanical Keyboard' })).toHaveCount(0);
    });

    await test.step('an unmatched search shows the empty state', async () => {
      await categoryFilter.selectOption('All categories');
      await search.fill('does-not-exist-in-catalog');
      await expect(page.getByRole('status')).toHaveText('No products match your search.');
      await expect(grid.getByRole('listitem')).toHaveCount(0);
    });
  });
});
