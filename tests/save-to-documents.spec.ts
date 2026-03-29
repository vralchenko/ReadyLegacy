import { test, expect } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(__dirname, '.auth-state.json');

test.use({ storageState: AUTH_FILE });

// Each tool is opened via /tools?tool=<key>

// ─── WillBuilder ─────────────────────────────────────────────────────────────

test.describe('WillBuilder — Save to Documents', () => {
    test('shows save button on step 4 and saves successfully', async ({ page }) => {
        await page.goto('/tools?tool=will-builder');
        await page.waitForTimeout(500);

        // Fill step 1 — name
        await page.locator('#will-builder input[type="text"]').first().fill('John Doe');

        // Navigate to step 4 via step indicators
        await page.getByText(/04\. Form/i).click();
        await page.waitForTimeout(300);

        // "Save to Documents" button should be visible on step 4
        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        // Click and intercept the API call
        const [response] = await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        expect(response.status()).toBe(201);

        // Verify request payload
        const body = JSON.parse(response.request().postData() || '{}');
        expect(body.title).toMatch(/Will/);
        expect(body.icon).toBe('\uD83D\uDCDC');
        expect(body.data.will_name).toBe('John Doe');

        // Should show confirmation text
        await expect(page.getByText(/Saved to Documents/i)).toBeVisible();

        // Button should be replaced by confirmation
        await expect(saveBtn).not.toBeVisible();
    });
});

// ─── AssetOverview ───────────────────────────────────────────────────────────

test.describe('AssetOverview — Save to Documents', () => {
    test('shows save button on step 6 and saves successfully', async ({ page }) => {
        await page.goto('/tools?tool=asset-overview');
        await page.waitForTimeout(500);

        // Fill step 1 field
        await page.locator('#asset-overview input[type="text"]').first().fill('Family apartment');

        // Navigate to step 6 via step indicator
        await page.getByText('06. Others').click();
        await page.waitForTimeout(300);

        // "Save to Documents" button should be visible
        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        // Click and intercept
        const [response] = await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        expect(response.status()).toBe(201);

        const body = JSON.parse(response.request().postData() || '{}');
        expect(body.title).toMatch(/Asset Overview/);
        expect(body.icon).toBe('\uD83D\uDCB0');
        expect(body.data.asset_brought).toBe('Family apartment');

        // Should show confirmation
        await expect(page.getByText(/Saved to Documents/i)).toBeVisible();
    });
});

// ─── LegalDocs ───────────────────────────────────────────────────────────────

test.describe('LegalDocs — Save to Documents', () => {
    test('shows save button near progress and saves all doc records', async ({ page }) => {
        await page.goto('/tools?tool=legal-docs');
        await page.waitForTimeout(500);

        // "Save to Documents" button should be visible right away
        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        // Click and intercept
        const [response] = await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        expect(response.status()).toBe(201);

        const body = JSON.parse(response.request().postData() || '{}');
        expect(body.title).toBe('Legal Documents Summary');
        expect(body.icon).toBe('\u2696\uFE0F');
        expect(body.type).toBe('Legal Documents');
        // Should contain all 8 document keys
        expect(Object.keys(body.data)).toContain('living_will');
        expect(Object.keys(body.data)).toContain('will');
        expect(Object.keys(body.data)).toContain('organ_donation');

        // Should show confirmation
        await expect(page.getByText(/Saved to Documents/i)).toBeVisible();
        await expect(saveBtn).not.toBeVisible();
    });
});

// ─── Executor ────────────────────────────────────────────────────────────────

test.describe('Executor — Save to Documents', () => {
    test('save button appears after adding a task', async ({ page }) => {
        await page.goto('/tools?tool=executor');
        await page.waitForTimeout(500);

        // Add a task first (button only shows when progress bar is visible = tasks > 0)
        await page.getByPlaceholder(/add a new task/i).fill('Test task for documents');
        await page.getByRole('button', { name: /add/i }).click();
        await page.waitForTimeout(300);

        // "Save to Documents" button should now be visible in the progress bar area
        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        // Click and intercept
        const [response] = await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        expect(response.status()).toBe(201);

        const body = JSON.parse(response.request().postData() || '{}');
        expect(body.title).toMatch(/Executor Tasks/);
        expect(body.icon).toBe('\u2705');
        expect(body.data.tasks).toBeInstanceOf(Array);
        expect(body.data.tasks.length).toBeGreaterThanOrEqual(1);
        expect(body.data.tasks[0].text).toBe('Test task for documents');

        // Should show "Saved" confirmation
        await expect(page.getByText(/Saved/i).first()).toBeVisible();
    });
});

// ─── LeaveBehind ─────────────────────────────────────────────────────────────

test.describe('LeaveBehind — Save to Documents', () => {
    test('save button appears after adding a memory', async ({ page }) => {
        await page.goto('/tools?tool=leave-behind');
        await page.waitForTimeout(500);

        // Open the add-memory wizard
        await page.getByText(/add memory/i).click();
        await page.waitForTimeout(400);

        // Step 0: type is pre-selected (text), click Next
        await page.getByRole('button', { name: /next/i }).click();
        await page.waitForTimeout(300);

        // Step 1: fill title and content
        await page.getByPlaceholder(/give this memory/i).fill('A letter to my family');
        await page.locator('textarea').first().fill('Dear family, I love you all.');
        await page.getByRole('button', { name: /next/i }).click();
        await page.waitForTimeout(300);

        // Step 2: skip recipient, click Next
        await page.getByRole('button', { name: /next/i }).click();
        await page.waitForTimeout(300);

        // Step 3: review — submit
        await page.getByRole('button', { name: /add to vault/i }).click();
        await page.waitForTimeout(500);

        // "Save to Documents" button should now be visible in the stats bar
        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        // Click and intercept
        const [response] = await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        expect(response.status()).toBe(201);

        const body = JSON.parse(response.request().postData() || '{}');
        expect(body.title).toBe('Digital Legacy Vault');
        expect(body.icon).toBe('\uD83D\uDC8C');
        expect(body.data.memories).toBeInstanceOf(Array);
        expect(body.data.memories.length).toBeGreaterThanOrEqual(1);
        expect(body.data.memories[0].title).toBe('A letter to my family');

        // Should show "Saved" confirmation
        await expect(page.getByText(/Saved/i).first()).toBeVisible();
    });
});

// ─── Verify documents appear on the Documents page ───────────────────────────

test.describe('Documents page after saving', () => {
    test('LegalDocs save + verify on Documents page', async ({ page }) => {
        // Save from LegalDocs (no prerequisites needed)
        await page.goto('/tools?tool=legal-docs');
        await page.waitForTimeout(500);

        const saveBtn = page.getByRole('button', { name: 'Save to Documents' });
        await expect(saveBtn).toBeVisible({ timeout: 3000 });

        await Promise.all([
            page.waitForResponse(
                resp => resp.url().includes('/api/documents') && resp.request().method() === 'POST',
                { timeout: 10000 }
            ),
            saveBtn.click(),
        ]);
        await expect(page.getByText(/Saved to Documents/i)).toBeVisible();

        // Now navigate to Documents page and verify
        await page.goto('/documents');
        await page.waitForTimeout(1000);

        await expect(page.getByText(/Legal Documents Summary/i).first()).toBeVisible({ timeout: 5000 });
    });
});
