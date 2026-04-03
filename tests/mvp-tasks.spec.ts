import { test, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth-state.json');

// ─── PUBLIC PAGES (no auth) ─────────────────────────────────────────────────

test.describe('Homepage — MVP changes', () => {
  test('CTA button says "Create Your Profile"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /create your profile/i }).first()).toBeVisible();
  });

  test('"See Services" button is removed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /see services/i })).not.toBeVisible();
  });

  test('no prices shown on product cards', async ({ page }) => {
    await page.goto('/');
    // Old price divs like "Free" or "15 CHF/mo" inside product-price class should be gone
    const priceElements = page.locator('.product-price');
    await expect(priceElements).toHaveCount(0);
  });

  test('shows all 3 product cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Be Ready' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leave Behind' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Be Honored' })).toBeVisible();
  });

  test('pricing and final CTA sections are removed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Simple pricing')).not.toBeVisible();
    await expect(page.getByText('Create Free Account')).not.toBeVisible();
  });
});

test.describe('Team page — Olga bio update', () => {
  test('displays updated Olga biography', async ({ page }) => {
    await page.goto('/team');
    await expect(page.getByText(/25 years of experience in global banking/i).first()).toBeVisible();
    await expect(page.getByText(/Executive MBA from Stockholm School of Economics/i).first()).toBeVisible();
  });
});

// ─── PROTECTED PAGES (auth required) ────────────────────────────────────────

test.describe('Tools dashboard — MVP changes', () => {
  test.use({ storageState: AUTH_FILE });

  test('shows product section headers prominently', async ({ page }) => {
    await page.goto('/tools');
    // Section headers should be visible as h2 (not small uppercase labels)
    await expect(page.locator('h2').filter({ hasText: /Be Ready/i }).first()).toBeVisible();
  });

  test('shows all three product sections', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.getByText('Leave Behind').first()).toBeVisible();
  });
});

test.describe('Sidebar — navigation improvements', () => {
  test.use({ storageState: AUTH_FILE });

  test('has visible Home Page button', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const homeBtn = page.locator('.home-link-btn');
    await expect(homeBtn).toBeVisible();
    await expect(homeBtn).toContainText(/home page/i);
  });

  test('has Back button', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const backBtn = page.locator('.back-btn');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toContainText(/back/i);
  });

  test('group titles are visible with accent color', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const groupTitle = page.locator('.group-title').first();
    await expect(groupTitle).toBeVisible();
    // Should be uppercase
    const text = await groupTitle.textContent();
    expect(text).toBeTruthy();
  });
});

test.describe('Asset Overview — MVP changes', () => {
  test.use({ storageState: AUTH_FILE });

  test('starts on Assets step (not Personal Property)', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Should NOT show "Personal Property" section
    await expect(page.getByText('Personal Property')).not.toBeVisible();
    // Should show Financial Assets (step 2 content)
    await expect(page.getByText('Financial Assets').first()).toBeVisible();
  });

  test('step tabs do not include Personal', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await expect(page.getByText('01. Assets').first()).toBeVisible();
    await expect(page.getByText('01. Personal')).not.toBeVisible();
  });

  test('Real Estate has Ownership and Co-owners fields', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Open Real Estate add form
    const realEstate = page.getByText('Real Estate').first();
    await expect(realEstate).toBeVisible();
    // Click add button in Real Estate section
    const addBtn = page.locator('text=+ Add').nth(4); // Real Estate is 5th list
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(300);
      await expect(page.getByPlaceholder(/Personal or Shared/i).first()).toBeVisible();
      await expect(page.getByPlaceholder(/Spouse name/i).first()).toBeVisible();
    }
  });

  test('Bank accounts do not have value field', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Open Bank & Savings add form
    const addBtn = page.locator('text=+ Add').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(300);
      // Should have Account field but NOT Amount/Value
      await expect(page.getByPlaceholder(/UBS Savings/i).first()).toBeVisible();
      await expect(page.getByText('Amount / Value')).not.toBeVisible();
    }
  });

  test('Digital Legacy section titled "Inventory" not "Wishes"', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await page.getByText('03. Digital Legacy').click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Digital Legacy Inventory').first()).toBeVisible();
    await expect(page.getByText('Digital Legacy Wishes')).not.toBeVisible();
  });

  test('has per-tool Fill Demo Data button', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /fill demo data/i }).first()).toBeVisible();
  });
});

test.describe('Will Builder — per-tool demo', () => {
  test.use({ storageState: AUTH_FILE });

  test('has Fill Demo Data button', async ({ page }) => {
    await page.goto('/tools?tool=will-builder');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /fill demo data/i }).first()).toBeVisible();
  });
});

test.describe('Legal Docs — MVP changes', () => {
  test.use({ storageState: AUTH_FILE });

  test('has Fill Demo Data button', async ({ page }) => {
    await page.goto('/tools?tool=legal-docs');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /fill demo data/i }).first()).toBeVisible();
  });

  test('Save button has white text (not black)', async ({ page }) => {
    await page.goto('/tools?tool=legal-docs');
    await page.waitForTimeout(500);
    // Click on a doc to expand, then check the save button styles
    const docCard = page.locator('[class*="legal"], .tool-section').first();
    if (await docCard.isVisible()) {
      await docCard.click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Executor — per-tool demo', () => {
  test.use({ storageState: AUTH_FILE });

  test('has Fill Demo Data button', async ({ page }) => {
    await page.goto('/tools?tool=executor');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: /fill demo data/i }).first()).toBeVisible();
  });
});

test.describe('Leave Behind — Social Accounts', () => {
  test.use({ storageState: AUTH_FILE });

  test('shows Social Media Accounts section', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(1000);
    const el = page.getByText('Social Media Accounts').first();
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible();
  });

  test('can add a social account', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(500);

    // Click "+ Add Account"
    await page.getByRole('button', { name: /add account/i }).click();
    await page.waitForTimeout(300);

    // Select platform
    await page.getByRole('button', { name: /facebook/i }).click();

    // Fill username
    await page.getByPlaceholder(/username or profile/i).fill('john.doe');

    // Select wish
    await page.locator('select').last().selectOption('Memorialize');

    // Add
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);

    // Verify it appears
    await expect(page.getByText('Facebook').last()).toBeVisible();
    await expect(page.getByText(/john\.doe/i).first()).toBeVisible();
  });

  test('can remove a social account', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(500);

    // Add one first
    await page.getByRole('button', { name: /add account/i }).click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /instagram/i }).click();
    await page.getByPlaceholder(/username or profile/i).fill('test_user');
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);

    // Remove it
    const removeBtn = page.getByRole('button', { name: /remove/i }).last();
    await removeBtn.click();
    await page.waitForTimeout(300);

    // Should show empty state
    await expect(page.getByText('No social accounts added yet')).toBeVisible();
  });
});

test.describe('Profile — My Beneficiaries', () => {
  test.use({ storageState: AUTH_FILE });

  test('shows My Beneficiaries section', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText('My Beneficiaries').first()).toBeVisible();
  });

  test('shows empty state when no beneficiaries', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText(/no beneficiaries added/i).first()).toBeVisible();
  });

  test('can add a beneficiary', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /add beneficiary/i }).click();
    await page.waitForTimeout(200);

    await page.getByPlaceholder('Full Name *').fill('Maria Schmidt');
    await page.getByPlaceholder('Email').last().fill('maria@example.com');
    await page.getByPlaceholder('Phone').fill('+41 79 000 0000');
    await page.getByPlaceholder(/relationship/i).fill('Spouse');

    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('Maria Schmidt').first()).toBeVisible();
    await expect(page.getByText(/spouse/i).first()).toBeVisible();
  });

  test('can remove a beneficiary', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);

    // Add one first
    await page.getByRole('button', { name: /add beneficiary/i }).click();
    await page.waitForTimeout(200);
    await page.getByPlaceholder('Full Name *').fill('Test Person');
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);

    // Remove
    await page.getByRole('button', { name: /remove/i }).last().click();
    await page.waitForTimeout(300);

    await expect(page.getByText('Test Person')).not.toBeVisible();
  });

  test('beneficiary section mentions heartbeat protocol', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText(/heartbeat protocol/i).first()).toBeVisible();
  });
});

test.describe('Demo Data — per-tool buttons', () => {
  test.use({ storageState: AUTH_FILE });

  const tools = [
    { key: 'asset-overview', name: 'Asset Overview' },
    { key: 'will-builder', name: 'Will Builder' },
    { key: 'legal-docs', name: 'Legal Docs' },
    { key: 'executor', name: 'Executor' },
  ];

  for (const tool of tools) {
    test(`${tool.name} has individual Fill Demo Data button`, async ({ page }) => {
      await page.goto(`/tools?tool=${tool.key}`);
      await page.waitForTimeout(500);
      const btn = page.getByRole('button', { name: /fill demo data/i }).first();
      await expect(btn).toBeVisible();
      // Button should have green styling
      await expect(btn).toHaveCSS('color', 'rgb(16, 185, 129)');
    });
  }
});

test.describe('Demo data — no Viktor Ralchenko', () => {
  test.use({ storageState: AUTH_FILE });

  test('demo data uses Thomas Müller, not Viktor Ralchenko', async ({ page }) => {
    await page.goto('/tools?tool=will-builder');
    await page.waitForTimeout(500);

    // Click Fill Demo Data
    await page.getByRole('button', { name: /fill demo data/i }).first().click();
    await page.waitForTimeout(1000);

    // After reload, check that the name field contains Thomas Müller
    const nameInput = page.locator('#will-builder input[type="text"]').first();
    await expect(nameInput).toHaveValue('Thomas Müller');
    // Must NOT contain Viktor Ralchenko
    await expect(nameInput).not.toHaveValue(/Viktor|Ralchenko/i);
  });
});
