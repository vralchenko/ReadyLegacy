import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders hero section with title and CTA button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/estate planning/i);
    await expect(page.getByRole('link', { name: /create your profile/i }).first()).toBeVisible();
  });

  test('renders "What we offer" section with 3 pillars', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('What we offer')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Be Ready' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leave Behind' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Be Honored' })).toBeVisible();
  });

  test('shows Free and Paid tier badges', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Free').first()).toBeVisible();
    await expect(page.getByText('15 CHF / month').first()).toBeVisible();
  });

  test('product cards are clickable links', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.product-card-clickable').first();
    await expect(card).toBeVisible();
    // Verify it's an <a> tag (Link component)
    await expect(card).toHaveAttribute('href', /\/tools/);
  });

  test('no pricing section or Create Free Account section exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Simple pricing')).not.toBeVisible();
    await expect(page.getByText('Start your free account')).not.toBeVisible();
  });

  test('header navigation links are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /mission/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tools/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /documents/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /team/i })).toBeVisible();
  });

  test('footer with compliance badges is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Swiss Made')).toBeVisible();
    await expect(page.getByText('GDPR Ready')).toBeVisible();
    await expect(page.getByText('nDSG Compliant')).toBeVisible();
  });
});

test.describe('Mission page', () => {
  test('renders mission content', async ({ page }) => {
    await page.goto('/mission');
    await expect(page).toHaveURL(/\/mission/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('displays the 3 pillars', async ({ page }) => {
    await page.goto('/mission');
    await expect(page.getByText(/Be Ready/).first()).toBeVisible();
    await expect(page.getByText(/Leave Behind/).first()).toBeVisible();
    await expect(page.getByText(/Be Honored/).first()).toBeVisible();
  });
});

test.describe('Team page', () => {
  test('renders founder profiles', async ({ page }) => {
    await page.goto('/team');
    await expect(page).toHaveURL(/\/team/);
    await expect(page.getByText(/Inna/).first()).toBeVisible();
    await expect(page.getByText(/Olga/).first()).toBeVisible();
    await expect(page.getByText(/Viktor/).first()).toBeVisible();
  });
});

test.describe('Contact page', () => {
  test('renders contact information', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('main, .contact, .page, [class*="contact"]').first()).toBeVisible();
  });
});

test.describe('Privacy page', () => {
  test('renders privacy policy', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.getByText(/privacy/i).first()).toBeVisible();
  });
});

test.describe('Impressum page', () => {
  test('renders impressum/legal info', async ({ page }) => {
    await page.goto('/impressum');
    await expect(page).toHaveURL(/\/impressum/);
    await expect(page.getByText(/impressum/i).first()).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('navigate from Home to Mission', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /mission/i }).click();
    await expect(page).toHaveURL(/\/mission/);
  });

  test('navigate from Home to Team', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /team/i }).click();
    await expect(page).toHaveURL(/\/team/);
  });

  test('clicking logo navigates to home', async ({ page }) => {
    await page.goto('/mission');
    await page.getByRole('link', { name: /ready legacy/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Language switch', () => {
  test('can switch to German', async ({ page }) => {
    await page.goto('/');
    const deButton = page.getByRole('button', { name: /de/i });
    if (await deButton.isVisible()) {
      await deButton.click();
      await expect(page.getByText(/Was wir anbieten|Digitale Plattform/i).first()).toBeVisible();
    }
  });
});
