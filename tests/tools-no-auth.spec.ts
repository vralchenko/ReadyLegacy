import { test, expect } from '@playwright/test';

test('tools page accessible without login', async ({ browser }) => {
    // Fresh context — no auth state
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://readylegacy.pages.dev/tools');
    // Should see the tools dashboard, not a login redirect
    await expect(page.locator('text=Be Ready')).toBeVisible({ timeout: 10000 });
    await ctx.close();
});

test('save button redirects to pricing when not authenticated', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://readylegacy.pages.dev/tools?tool=executor');
    // Add a test task first
    const input = page.locator('input[placeholder]').first();
    await input.fill('Test task');
    await page.keyboard.press('Enter');
    // Click save to documents
    const saveBtn = page.locator('button:has-text("Save to Documents")');
    if (await saveBtn.isVisible({ timeout: 5000 })) {
        await saveBtn.click();
        // Should redirect to pricing with returnTo param
        await expect(page).toHaveURL(/\/pricing\?returnTo=/, { timeout: 10000 });
    }
    await ctx.close();
});
