import { test } from '@playwright/test';

test.use({
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
});

test('Record all Apr 6 changes walkthrough', async ({ browser }) => {
    test.setTimeout(120000);
    // Use fresh context — NO login, to show tools work without auth
    const ctx = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: 'test-results/videos/', size: { width: 1280, height: 720 } },
    });
    const page = await ctx.newPage();

    // === 1. Home page — new security section ===
    await page.goto('https://readylegacy.pages.dev/');
    await page.waitForTimeout(1500);
    // Scroll down to security section
    await page.evaluate(() => {
        const main = document.querySelector('main') || window;
        if (main instanceof HTMLElement) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
        else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // === 2. Tools page without login ===
    await page.goto('https://readylegacy.pages.dev/tools');
    await page.waitForTimeout(2000);

    // === 3. Click Free tier badge → info modal ===
    const freeBadge = page.locator('span:has-text("Free ℹ️")').first();
    if (await freeBadge.isVisible({ timeout: 3000 })) {
        await freeBadge.click();
        await page.waitForTimeout(2000);
        // Close modal
        await page.locator('button:has-text("Got it")').click();
        await page.waitForTimeout(500);
    }

    // === 4. Click Paid tier badge → info modal ===
    const paidBadge = page.locator('span:has-text("15 CHF")').first();
    if (await paidBadge.isVisible({ timeout: 3000 })) {
        await paidBadge.click();
        await page.waitForTimeout(2000);
        await page.locator('button:has-text("Got it")').click();
        await page.waitForTimeout(500);
    }

    // === 5. Open Asset Overview — bright Add button + indicative label ===
    await page.goto('https://readylegacy.pages.dev/tools?tool=asset-overview');
    await page.waitForTimeout(1500);
    // Click Add Item to show bright button
    const addBtn = page.locator('button:has-text("+ Add Item")').first();
    if (await addBtn.isVisible({ timeout: 3000 })) {
        await addBtn.click();
        await page.waitForTimeout(1500);
        // Show red Cancel button
        const cancelBtn = page.locator('button:has-text("Cancel")').first();
        if (await cancelBtn.isVisible({ timeout: 2000 })) {
            await cancelBtn.click();
            await page.waitForTimeout(500);
        }
    }

    // Scroll down to show Back/Next nav
    await page.evaluate(() => {
        const main = document.querySelector('main') || window;
        if (main instanceof HTMLElement) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
        else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // === 6. Click Next to go to Will Builder ===
    const nextBtn = page.locator('button:has-text("→")').last();
    if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(1500);
    }

    // === 7. Go to Executor — try Save → redirects to pricing ===
    await page.goto('https://readylegacy.pages.dev/tools?tool=executor');
    await page.waitForTimeout(1500);
    // Add a task
    const taskInput = page.locator('input[placeholder]').first();
    await taskInput.fill('Notify bank about the estate');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    // Click Save to Documents
    const saveBtn = page.locator('button:has-text("Save to Documents")');
    if (await saveBtn.isVisible({ timeout: 3000 })) {
        await saveBtn.click();
        await page.waitForTimeout(2500);
    }

    // === 8. Pricing page should be visible ===
    await page.waitForTimeout(2000);

    // === 9. Go to Templates — show Pro Senectute checklist ===
    await page.goto('https://readylegacy.pages.dev/tools?tool=templates');
    await page.waitForTimeout(1500);
    // Scroll to bottom to see Pro Senectute template
    await page.evaluate(() => {
        const main = document.querySelector('main') || window;
        if (main instanceof HTMLElement) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
        else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // === 10. Back to All Tools via nav ===
    await page.goto('https://readylegacy.pages.dev/tools');
    await page.waitForTimeout(2000);

    await ctx.close();
});
