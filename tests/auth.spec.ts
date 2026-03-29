import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const CREDS_FILE = path.join(__dirname, '.test-creds.json');

function getTestCreds() {
  return JSON.parse(fs.readFileSync(CREDS_FILE, 'utf-8'));
}

test.describe('Login page', () => {
  test('renders login form with email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('form button[type="submit"]')).toBeVisible();
  });

  test('renders Google sign-in button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/continue with google/i)).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('your@email.com').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText(/invalid|error|incorrect/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('can switch between Sign In and Create Account tabs', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Create Account').click();
    await expect(page.getByPlaceholder(/name/i)).toBeVisible();
    await page.getByText('Sign In').first().click();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
  });
});

test.describe('Protected routes redirect to login', () => {
  test('/tools redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/tools');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/documents redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/documents');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/profile redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Login and Logout flow', () => {
  test('login with valid credentials, access protected page, then logout', async ({ page }) => {
    const { email, password } = getTestCreds();

    await page.goto('/login');
    await page.getByPlaceholder('your@email.com').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();

    // Should be logged in
    await expect(page.getByText(/sign out/i).first()).toBeVisible({ timeout: 15000 });

    // Navigate to protected pages via header links (SPA navigation preserves auth)
    await page.getByRole('link', { name: 'Tools', exact: true }).click();
    await expect(page).toHaveURL(/\/tools/, { timeout: 5000 });

    await page.getByRole('link', { name: 'Documents', exact: true }).click();
    await expect(page).toHaveURL(/\/documents/, { timeout: 5000 });

    // Logout
    await page.getByText(/sign out/i).first().click();
    await page.waitForTimeout(1000);

    // Should redirect after logout
    await page.goto('/tools');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Registration validation', () => {
  test('validates password length', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Create Account').click();
    await page.getByPlaceholder(/name/i).fill('Test User');
    await page.getByPlaceholder('your@email.com').fill('test-short-pw@example.com');
    await page.locator('input[type="password"]').fill('123');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText(/6 characters|too short|at least/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('prevents duplicate registration', async ({ page }) => {
    const { email } = getTestCreds();

    await page.goto('/login');
    await page.getByText('Create Account').click();
    await page.getByPlaceholder(/name/i).fill('Dup Test');
    await page.getByPlaceholder('your@email.com').fill(email);
    await page.locator('input[type="password"]').fill('AnotherPass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText(/already exists|already registered|duplicate/i).first()).toBeVisible({ timeout: 5000 });
  });
});
