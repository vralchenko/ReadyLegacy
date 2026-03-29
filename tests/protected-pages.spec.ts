import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth-state.json');

// Use saved auth state for all tests in this file
test.use({ storageState: AUTH_FILE });

test.describe('Tools page', () => {
  test('renders tools dashboard with categories', async ({ page }) => {
    await page.goto('/tools');
    await expect(page).toHaveURL(/\/tools/);
    await expect(page.getByText(/Your Tools|Be Ready/i).first()).toBeVisible();
  });

  test('can open Asset Overview tool', async ({ page }) => {
    await page.goto('/tools');
    await page.getByText(/asset overview/i).first().click();
    await expect(page.getByText(/asset/i).first()).toBeVisible();
  });

  test('can open Will Builder tool', async ({ page }) => {
    await page.goto('/tools');
    await page.getByText(/will builder/i).first().click();
    await expect(page.getByText(/will/i).first()).toBeVisible();
  });

  test('can open Legal Documents tool', async ({ page }) => {
    await page.goto('/tools');
    await page.getByText(/legal doc/i).first().click();
    await expect(page.getByText(/legal/i).first()).toBeVisible();
  });
});

test.describe('Documents page', () => {
  test('renders documents page', async ({ page }) => {
    await page.goto('/documents');
    await expect(page).toHaveURL(/\/documents/);
    await expect(page.getByText(/document/i).first()).toBeVisible();
  });
});

test.describe('Profile page', () => {
  test('renders profile page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.getByText(/profile|account/i).first()).toBeVisible();
  });

  test('displays plan information', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText(/free|premium|plan/i).first()).toBeVisible();
  });
});

test.describe('Chat widget', () => {
  test('chat widget is accessible on pages', async ({ page }) => {
    await page.goto('/');
    const chatButton = page.locator('[class*="chat"], [class*="Chat"]').first();
    if (await chatButton.isVisible()) {
      await chatButton.click();
      await expect(page.locator('input[placeholder], textarea').last()).toBeVisible({ timeout: 3000 });
    }
  });
});
