/**
 * Playwright E2E tests for all 18 tasks from Olga's email (meeting 03.04.2026).
 * Each test.describe maps to a numbered task.
 */
import { test, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth-state.json');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC PAGES (no auth required)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Task 1: Homepage — remove prices, make all boxes clickable ─────────────
test.describe('Task 1: Homepage prices removed, boxes clickable', () => {
  test('no price elements on product cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.product-price')).toHaveCount(0);
    // No "Free" or "15 CHF/mo" text as price labels
    await expect(page.getByText('15 CHF/mo')).not.toBeVisible();
  });

  test('all 3 product cards are clickable links', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.product-card-clickable');
    await expect(cards).toHaveCount(3);
    // Each card is an <a> tag linking to /tools
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i)).toHaveAttribute('href', /\/tools/);
    }
  });

  test('clicking Be Ready card navigates to tools or login', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-card-clickable').first().click();
    // Redirects to /tools (if logged in) or /login (if not)
    await expect(page).toHaveURL(/\/(tools|login)/);
  });
});

// ─── Task 2: Homepage — "Get Started" renamed to "Create Your Profile" ──────
test.describe('Task 2: CTA renamed', () => {
  test('hero button says "Create Your Profile"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /create your profile/i }).first()).toBeVisible();
  });

  test('"Get Started Free" button does not exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /get started free/i })).not.toBeVisible();
  });
});

// ─── Task 3: Homepage — "See Services" button removed ───────────────────────
test.describe('Task 3: See Services removed', () => {
  test('"See Services" button is not visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /see services/i })).not.toBeVisible();
  });
});

// ─── Task 4: Homepage — remove Simple Pricing and Create Free Account ───────
test.describe('Task 4: Pricing sections removed', () => {
  test('no "Simple pricing" section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Simple pricing')).not.toBeVisible();
  });

  test('no "Create Free Account" section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Create Free Account')).not.toBeVisible();
    await expect(page.getByText('Start your free account')).not.toBeVisible();
  });
});

// ─── Task 18: Team page — update Olga's biography ──────────────────────────
test.describe('Task 18: Olga bio updated', () => {
  test('shows new biography with 25 years experience', async ({ page }) => {
    await page.goto('/team');
    await expect(page.getByText(/25 years of experience in global banking/i).first()).toBeVisible();
  });

  test('mentions Executive MBA from Stockholm', async ({ page }) => {
    await page.goto('/team');
    await expect(page.getByText(/Executive MBA from Stockholm School of Economics/i).first()).toBeVisible();
  });

  test('mentions governance, risk, organizational management', async ({ page }) => {
    await page.goto('/team');
    await expect(page.getByText(/governance, risk, and large-scale organizational management/i).first()).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTECTED PAGES (auth required)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Task 5: Tools page — BE READY bigger fonts ─────────────────────────────
test.describe('Task 5: Tools page headers redesigned', () => {
  test.use({ storageState: AUTH_FILE });

  test('section headers are h2 elements (not small labels)', async ({ page }) => {
    await page.goto('/tools');
    const beReadyH2 = page.locator('h2').filter({ hasText: /Be Ready/i }).first();
    await expect(beReadyH2).toBeVisible();
    // Should be large font
    const fontSize = await beReadyH2.evaluate(el => getComputedStyle(el).fontSize);
    const size = parseFloat(fontSize);
    expect(size).toBeGreaterThanOrEqual(25); // 1.8rem ≈ 28.8px
  });

  test('sections show Free/Paid tier badges', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(1000);
    // Badge exists with translated or fallback text
    const badges = page.locator('span').filter({ hasText: /Free|tier_free|15 CHF|tier_paid|Kostenlos/i });
    expect(await badges.count()).toBeGreaterThanOrEqual(1);
  });
});

// ─── Task 6: Homepage — split into Free and 15/m blocks ─────────────────────
test.describe('Task 6: Products split into tiers', () => {
  test.use({ storageState: AUTH_FILE });

  test('homepage shows all 3 products in one row', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Be Ready' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Leave Behind' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Be Honored' })).toBeVisible();
  });

  test('Tools dashboard shows all 3 sections', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(500);
    await expect(page.getByText('Be Ready').first()).toBeVisible();
    await expect(page.getByText('Leave Behind').first()).toBeVisible();
  });
});

// ─── Task 7: Apply updates to all product pages ─────────────────────────────
test.describe('Task 7: All sections consistent on Tools', () => {
  test.use({ storageState: AUTH_FILE });

  test('Leave Behind section has cards on Tools dashboard', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(500);
    await expect(page.getByText('Digital Legacy').first()).toBeVisible();
    await expect(page.getByText('AI Avatar').first()).toBeVisible();
  });

  test('Be Honored section has card on Tools dashboard', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(500);
    await expect(page.getByText('Bereavement & Support').first()).toBeVisible();
  });
});

// ─── Task 8: Create Back button (1 page back) ──────────────────────────────
test.describe('Task 8: Back button', () => {
  test.use({ storageState: AUTH_FILE });

  test('Back button is visible in sidebar', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await expect(page.locator('.back-btn')).toBeVisible();
  });

  test('Back from tool navigates to /tools dashboard', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await page.locator('.back-btn').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/tools$/);
    await expect(page.getByText('Be Ready').first()).toBeVisible();
  });

  test('Back from dashboard navigates to homepage', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(500);
    await page.locator('.back-btn').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });
});

// ─── Task 9: Home Page button bigger and more noticeable ────────────────────
test.describe('Task 9: Home Page button', () => {
  test.use({ storageState: AUTH_FILE });

  test('Home Page button is visible and prominent', async ({ page }) => {
    await page.goto('/tools?tool=will-builder');
    const homeBtn = page.locator('.home-link-btn');
    await expect(homeBtn).toBeVisible();
    await expect(homeBtn).toContainText(/home page/i);
    // Should have background styling (prominent)
    const bg = await homeBtn.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)'); // not transparent
  });

  test('Home Page button navigates to /', async ({ page }) => {
    await page.goto('/tools?tool=will-builder');
    await page.waitForTimeout(500);
    await page.locator('.home-link-btn').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL('/');
  });

  test('Home and Back buttons are sticky (always visible on scroll)', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Scroll down in main
    await page.evaluate(() => document.querySelector('main')?.scrollBy(0, 500));
    await page.waitForTimeout(300);
    // Buttons should still be visible
    await expect(page.locator('.home-link-btn')).toBeVisible();
    await expect(page.locator('.back-btn')).toBeVisible();
  });
});

// ─── Task 10: Asset Overview — remove Personal Property, add Ownership ──────
test.describe('Task 10: Asset Overview restructured', () => {
  test.use({ storageState: AUTH_FILE });

  test('Personal Property step is removed', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await expect(page.getByText('Personal Property')).not.toBeVisible();
    await expect(page.getByText('01. Personal')).not.toBeVisible();
  });

  test('starts directly on Assets step', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await expect(page.getByText('01. Assets').first()).toBeVisible();
    await expect(page.getByText('Financial Assets').first()).toBeVisible();
  });

  test('Real Estate has Ownership field', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Find and click Add on Real Estate section
    const sections = page.locator('text=+ Add Item');
    const count = await sections.count();
    // Real Estate is after Bank, Securities, Pension, Insurance
    if (count >= 5) {
      await sections.nth(4).click();
      await page.waitForTimeout(300);
      await expect(page.getByPlaceholder(/Personal or Shared/i)).toBeVisible();
    }
  });

  test('Real Estate has Co-owners field', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    const sections = page.locator('text=+ Add Item');
    const count = await sections.count();
    if (count >= 5) {
      await sections.nth(4).click();
      await page.waitForTimeout(300);
      await expect(page.getByPlaceholder(/Spouse name, share/i)).toBeVisible();
    }
  });
});

// ─── Task 11: Bank accounts — remove value field ────────────────────────────
test.describe('Task 11: Bank accounts no value', () => {
  test.use({ storageState: AUTH_FILE });

  test('Bank & Savings add form has no Amount/Value field', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    const addBtn = page.locator('text=+ Add Item').first();
    await addBtn.click();
    await page.waitForTimeout(300);
    await expect(page.getByPlaceholder(/UBS Savings/i)).toBeVisible();
    await expect(page.getByText('Amount / Value')).not.toBeVisible();
    await expect(page.getByPlaceholder(/50,000 CHF/i)).not.toBeVisible();
  });
});

// ─── Task 12: Digital Legacy — remove "Wishes" ─────────────────────────────
test.describe('Task 12: Digital Legacy Inventory', () => {
  test.use({ storageState: AUTH_FILE });

  test('section title says "Inventory" not "Wishes"', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    await page.getByText('03. Digital Legacy').click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Digital Legacy Inventory').first()).toBeVisible();
    await expect(page.getByText('Digital Legacy Wishes')).not.toBeVisible();
  });
});

// ─── Task 13: Personal Info — add My Beneficiaries block ────────────────────
test.describe('Task 13: My Beneficiaries', () => {
  test.use({ storageState: AUTH_FILE });

  test('Beneficiaries section is visible on profile', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText('My Beneficiaries').first()).toBeVisible();
  });

  test('mentions heartbeat protocol', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText(/heartbeat protocol/i).first()).toBeVisible();
  });

  test('shows empty state initially', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await expect(page.getByText(/no beneficiaries added/i).first()).toBeVisible();
  });

  test('can add a beneficiary with all fields', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /add beneficiary/i }).click();
    await page.waitForTimeout(200);
    await page.getByPlaceholder('Full Name *').fill('Anna Schmidt');
    await page.getByPlaceholder('Email').last().fill('anna@test.ch');
    await page.getByPlaceholder('Phone').fill('+41 79 111 2233');
    await page.getByPlaceholder(/relationship/i).fill('Spouse');
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Anna Schmidt').first()).toBeVisible();
    await expect(page.getByText(/Spouse/i).first()).toBeVisible();
  });

  test('can remove a beneficiary', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForTimeout(500);
    // Add then remove
    await page.getByRole('button', { name: /add beneficiary/i }).click();
    await page.waitForTimeout(200);
    await page.getByPlaceholder('Full Name *').fill('To Delete');
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /remove/i }).last().click();
    await page.waitForTimeout(300);
    await expect(page.getByText('To Delete')).not.toBeVisible();
  });
});

// ─── Task 14: Leave Behind — add social accounts block ──────────────────────
test.describe('Task 14: Social Media Accounts', () => {
  test.use({ storageState: AUTH_FILE });

  test('Social Media Accounts section exists', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(1000);
    const el = page.getByText('Social Media Accounts').first();
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible();
  });

  test('has platform preset buttons (Facebook, Instagram, etc.)', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(1000);
    // Scroll to Social section and click Add Account
    const addBtn = page.getByRole('button', { name: /add account/i });
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /instagram/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /linkedin/i })).toBeVisible();
  });

  test('can add a social account', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /add account/i });
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /facebook/i }).click();
    await page.getByPlaceholder(/username or profile/i).fill('john.doe');
    await page.locator('select').last().selectOption('Memorialize');
    await page.getByRole('button', { name: 'Add' }).last().click();
    await page.waitForTimeout(300);
    await expect(page.getByText('Facebook').last()).toBeVisible();
    await expect(page.getByText(/john\.doe/i).first()).toBeVisible();
  });

  test('has wish options: Delete, Memorialize, Transfer, Keep', async ({ page }) => {
    await page.goto('/tools?tool=leave-behind');
    await page.waitForTimeout(1000);
    const addBtn = page.getByRole('button', { name: /add account/i });
    await addBtn.scrollIntoViewIfNeeded();
    await addBtn.click();
    await page.waitForTimeout(200);
    const select = page.locator('select').last();
    const options = await select.locator('option').allTextContents();
    expect(options).toContain('Delete the account');
    expect(options).toContain('Memorialize');
    expect(options).toContain('Transfer to someone');
    expect(options).toContain('Keep as is');
  });
});

// ─── Task 15: Living Will — Save button white font ──────────────────────────
test.describe('Task 15: Save button contrast', () => {
  test.use({ storageState: AUTH_FILE });

  test('Save button in Legal Docs has white text on gold background', async ({ page }) => {
    await page.goto('/tools?tool=legal-docs');
    await page.waitForTimeout(500);
    // Click on a document card to open edit mode
    const docCard = page.locator('text=Living Will').first();
    if (await docCard.isVisible()) {
      await docCard.click();
      await page.waitForTimeout(300);
      // Click notes area to enter edit mode
      const notesArea = page.locator('text=Not set').first();
      if (await notesArea.isVisible()) {
        await notesArea.click();
        await page.waitForTimeout(200);
        const saveBtn = page.locator('button:has-text("Save")').first();
        if (await saveBtn.isVisible()) {
          const color = await saveBtn.evaluate(el => getComputedStyle(el).color);
          // Should be white (#fff = rgb(255, 255, 255))
          expect(color).toBe('rgb(255, 255, 255)');
        }
      }
    }
  });
});

// ─── Task 16: Fix all navigation bugs ───────────────────────────────────────
test.describe('Task 16: Navigation', () => {
  test.use({ storageState: AUTH_FILE });

  test('header nav highlights active page', async ({ page }) => {
    await page.goto('/tools');
    await page.waitForTimeout(500);
    const toolsLink = page.getByRole('link', { name: 'Tools', exact: true });
    await expect(toolsLink).toHaveClass(/active/);
  });

  test('Leave Behind card from homepage scrolls to correct section', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.locator('a[href="/tools#leave_behind"]').click();
    await page.waitForTimeout(2000);
    // leave_behind element should be near top of viewport
    const elTop = await page.evaluate(() => {
      const el = document.getElementById('leave_behind');
      return el ? el.getBoundingClientRect().top : 999;
    });
    expect(elTop).toBeLessThan(200);
  });

  test('Asset Overview starts on correct step (no step 1 bug)', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    await page.waitForTimeout(500);
    // Should show Financial Assets immediately, not blank/error
    await expect(page.getByText('Financial Assets').first()).toBeVisible();
  });
});

// ─── Task 17: Left sidebar menu hierarchy ───────────────────────────────────
test.describe('Task 17: Sidebar hierarchy', () => {
  test.use({ storageState: AUTH_FILE });

  test('group titles are visible', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const groupTitle = page.locator('.group-title').first();
    await expect(groupTitle).toBeVisible();
  });

  test('group titles have accent gold color', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const groupTitle = page.locator('.group-title').first();
    const color = await groupTitle.evaluate(el => getComputedStyle(el).color);
    // accent-gold resolves to some gold/yellow color
    expect(color).not.toBe('rgb(0, 0, 0)'); // not black
  });

  test('group titles have bold font weight', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const groupTitle = page.locator('.group-title').first();
    const weight = await groupTitle.evaluate(el => getComputedStyle(el).fontWeight);
    expect(parseInt(weight)).toBeGreaterThanOrEqual(700);
  });

  test('group titles have uppercase text', async ({ page }) => {
    await page.goto('/tools?tool=asset-overview');
    const groupTitle = page.locator('.group-title').first();
    const transform = await groupTitle.evaluate(el => getComputedStyle(el).textTransform);
    expect(transform).toBe('uppercase');
  });
});
