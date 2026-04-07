import { test, expect } from '@playwright/test';

test.use({
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
});


async function waitForTranslations(page: any) {
    await expect(page.locator('text=Mission').first()).toBeVisible({ timeout: 10000 });
}

test('Full MVP demo', async ({ browser }) => {
    test.setTimeout(240000);

    const ctx = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: 'test-results/videos/', size: { width: 1280, height: 720 } },
    });
    const page = await ctx.newPage();

    // ╔══════════════════════════════════════════════════╗
    // ║  PART 1: WITHOUT LOGIN                          ║
    // ╚══════════════════════════════════════════════════╝

    // --- Home page ---
    await page.goto('https://readylegacy.pages.dev/', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2500);

    // Scroll to services
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollBy({ top: 400, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // Scroll to security section
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2500);

    // --- Tools dashboard (no login!) ---
    await page.goto('https://readylegacy.pages.dev/tools', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2500);

    // Click Free badge → modal
    const freeBadge = page.locator('span:has-text("Free")').first();
    if (await freeBadge.isVisible({ timeout: 3000 })) {
        await freeBadge.click();
        await page.waitForTimeout(2500);
        const gotIt = page.locator('button:has-text("Got it")');
        if (await gotIt.isVisible({ timeout: 2000 })) await gotIt.click();
        await page.waitForTimeout(500);
    }

    // --- Asset Overview — bright Add, indicative label ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=asset-overview', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2000);

    const addBtn = page.locator('button:has-text("+ Add Item")').first();
    if (await addBtn.isVisible({ timeout: 3000 })) {
        await addBtn.click();
        await page.waitForTimeout(1500);
        const nameInput = page.locator('input[placeholder*="UBS"]').first();
        if (await nameInput.isVisible({ timeout: 2000 })) {
            await nameInput.fill('UBS Savings Account');
            await page.waitForTimeout(500);
        }
        const saveItemBtn = page.locator('button:has-text("Save Item")');
        if (await saveItemBtn.isVisible({ timeout: 2000 })) {
            await saveItemBtn.click();
            await page.waitForTimeout(1000);
        }
    }

    // Scroll to show Back/Next nav
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // Next → Will Builder
    const nextBtn = page.locator('button:has-text("→")').last();
    if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(2000);
    }

    // --- Death Checklist (Pro Senectute) — 5 phases ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=death-checklist', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2000);

    // Expand Phase 1 and check items
    const phase1Header = page.locator('text=Phase 1').first();
    if (await phase1Header.isVisible({ timeout: 3000 })) {
        await phase1Header.click();
        await page.waitForTimeout(1000);
        const item1 = page.locator('text=Call a doctor').first();
        if (await item1.isVisible({ timeout: 2000 })) {
            await item1.click();
            await page.waitForTimeout(800);
        }
        const item2 = page.locator('text=Inform relatives').first();
        if (await item2.isVisible({ timeout: 2000 })) {
            await item2.click();
            await page.waitForTimeout(800);
        }
    }

    // Expand Phase 2
    const phase2Header = page.locator('text=Phase 2').first();
    if (await phase2Header.isVisible({ timeout: 3000 })) {
        await phase2Header.click();
        await page.waitForTimeout(1500);
    }

    // Expand Phase 3
    const phase3Header = page.locator('text=Phase 3').first();
    if (await phase3Header.isVisible({ timeout: 3000 })) {
        await phase3Header.click();
        await page.waitForTimeout(1500);
    }

    // Scroll down to show Phase 4, 5
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // --- Templates — show all including Pro Senectute ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=templates', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2000);

    // Scroll slowly through all templates
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollBy({ top: 400, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollBy({ top: 400, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // Scroll to bottom — Pro Senectute checklist template
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2500);

    // Open Pro Senectute checklist wizard
    const proSenectuteBtn = page.locator('button:has-text("Start Wizard")').last();
    if (await proSenectuteBtn.isVisible({ timeout: 3000 })) {
        await proSenectuteBtn.click();
        await page.waitForTimeout(2500);
        // Close wizard
        const closeBtn = page.locator('button:has-text("×")').first();
        if (await closeBtn.isVisible({ timeout: 2000 })) {
            await closeBtn.click();
            await page.waitForTimeout(500);
        }
    }

    // --- Executor — Save → pricing ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=executor', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(1500);
    const taskInput = page.locator('input[placeholder]').first();
    if (await taskInput.isVisible({ timeout: 3000 })) {
        await taskInput.fill('Contact bank about estate');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
    }
    const saveBtn = page.locator('button:has-text("Save to Documents")');
    if (await saveBtn.isVisible({ timeout: 3000 })) {
        await saveBtn.click();
        await page.waitForTimeout(3000);
    }

    // ╔══════════════════════════════════════════════════╗
    // ║  PART 2: REGISTER & LOGIN                       ║
    // ╚══════════════════════════════════════════════════╝

    // --- Login page → Create Account ---
    await page.goto('https://readylegacy.pages.dev/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Switch to Create Account tab
    await page.getByText('Create Account').click();
    await page.waitForTimeout(800);

    // Fill registration form
    await page.getByPlaceholder(/name/i).fill('Viktor Ralchenko');
    await page.waitForTimeout(400);
    await page.getByPlaceholder('your@email.com').fill(`demo-${Date.now()}@readylegacy.ch`);
    await page.waitForTimeout(400);
    await page.locator('input[type="password"]').fill('Demo123456!');
    await page.waitForTimeout(800);

    // Submit
    await page.locator('form button[type="submit"]').click();

    // Wait for redirect to profile
    await page.waitForURL('**/profile**', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Scroll to pricing
    await page.evaluate(() => {
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2500);

    // --- Documents ---
    await page.goto('https://readylegacy.pages.dev/documents', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // --- Executor — Save works when logged in ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=executor', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2000);
    const saveBtnAuth = page.locator('button:has-text("Save to Documents")');
    if (await saveBtnAuth.isVisible({ timeout: 3000 })) {
        await saveBtnAuth.click();
        await page.waitForTimeout(2500);
    }

    // --- Bereavement Support ---
    await page.goto('https://readylegacy.pages.dev/tools?tool=bereavement-support', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2500);

    // --- Tools dashboard ---
    await page.goto('https://readylegacy.pages.dev/tools', { waitUntil: 'networkidle' });
    await waitForTranslations(page);
    await page.waitForTimeout(2500);

    await ctx.close();
});
