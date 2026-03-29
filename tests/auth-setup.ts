import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth-state.json');
const CREDS_FILE = path.join(__dirname, '.test-creds.json');

setup('create test account and save auth state', async ({ page }) => {
  const email = `test-e2e-${Date.now()}@readylegacy.ch`;
  const password = 'TestPass123!';

  // Try to register with retries
  let success = false;
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto('/login');
    await page.getByText('Create Account').click();
    await page.getByPlaceholder(/name/i).fill('E2E Test User');
    await page.getByPlaceholder('your@email.com').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();

    try {
      await expect(page.getByText(/sign out/i).first()).toBeVisible({ timeout: 15000 });
      success = true;
      break;
    } catch {
      console.log(`Registration attempt ${attempt + 1} failed, retrying...`);
      await page.waitForTimeout(2000);
    }
  }

  if (!success) {
    throw new Error('Failed to register test account after 3 attempts');
  }

  // Save credentials for login tests
  fs.writeFileSync(CREDS_FILE, JSON.stringify({ email, password }));

  // Save auth state
  await page.context().storageState({ path: AUTH_FILE });
});
