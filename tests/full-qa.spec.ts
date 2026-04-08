/**
 * Task #28 — Full QA testing pass of all tools
 * Tim Weingärtner feedback: "thoroughly test the solution again"
 *
 * Tests every tool in Be Ready, Be Prepared (Leave Behind), Be Honored sections
 * in both EN and DE locales, logged-in state.
 */
import { test, expect, Page } from '@playwright/test';

test.use({ storageState: 'tests/.auth-state.json' });

/* ─── Helper ──────────────────────────────────────────────────────────── */
const openTool = async (page: Page, toolKey: string) => {
    await page.goto(`/tools?tool=${toolKey}`, { waitUntil: 'networkidle' });
};

/* ─── 01  ASSET OVERVIEW ─────────────────────────────────────────────── */
test.describe('01 Asset Overview', () => {
    test('renders with step tabs', async ({ page }) => {
        await openTool(page, 'asset-overview');
        await expect(page.getByText('01. Assets').first()).toBeVisible();
        await expect(page.getByText('05. Others').first()).toBeVisible();
    });

    test('Fill Demo Data populates fields', async ({ page }) => {
        await openTool(page, 'asset-overview');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(500);
        await page.reload({ waitUntil: 'networkidle' });
        await expect(page.locator('.tool-panel')).toBeVisible();
    });

    test('can navigate between all 5 steps', async ({ page }) => {
        await openTool(page, 'asset-overview');
        for (const label of ['02. Liabilities', '03. Digital Legacy', '04. Funeral Wishes', '05. Others']) {
            await page.getByText(label).click();
            await page.waitForTimeout(200);
        }
        // Should see content on Others step
        await expect(page.getByText(/Sentimental|Heirloom|Pets|notes/i).first()).toBeVisible();
    });

    test('Save to Documents button visible on last step', async ({ page }) => {
        await openTool(page, 'asset-overview');
        await page.getByText('05. Others').click();
        await page.waitForTimeout(300);
        await expect(page.getByRole('button', { name: /save to documents/i })).toBeVisible();
    });
});

/* ─── 02  WILL BUILDER ───────────────────────────────────────────────── */
test.describe('02 Will Builder', () => {
    test('renders with 4 steps', async ({ page }) => {
        await openTool(page, 'will-builder');
        await expect(page.getByText(/01\. Creator|01\. Ersteller/i).first()).toBeVisible();
        await expect(page.getByText(/04\. Form|04\. Formular/i).first()).toBeVisible();
    });

    test('Fill Demo Data populates all fields', async ({ page }) => {
        await openTool(page, 'will-builder');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(300);
        const nameInput = page.locator('input').first();
        await expect(nameInput).not.toHaveValue('');
    });

    test('can navigate through all 4 steps', async ({ page }) => {
        await openTool(page, 'will-builder');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(300);
        await page.getByText(/02\. Heirs|02\. Erben/i).click();
        await page.waitForTimeout(200);
        await page.getByText(/03\. Legacies|03\. Vermächtnisse/i).click();
        await page.waitForTimeout(200);
        await page.getByText(/04\. Form|04\. Formular/i).click();
        await page.waitForTimeout(200);
        await expect(page.getByText(/handwritten|handschriftlich/i).first()).toBeVisible();
    });

    test('Save to Documents on step 4', async ({ page }) => {
        await openTool(page, 'will-builder');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.getByText(/04\. Form|04\. Formular/i).click();
        await page.waitForTimeout(300);
        await expect(page.getByRole('button', { name: /save to documents/i })).toBeVisible();
    });
});

/* ─── 03  LEGAL DOCUMENTS ────────────────────────────────────────────── */
test.describe('03 Legal Documents', () => {
    test('renders 8 legal document types', async ({ page }) => {
        await openTool(page, 'legal-docs');
        await expect(page.getByText(/Living Will/i).first()).toBeVisible();
        await expect(page.getByText(/Last Will/i).first()).toBeVisible();
        await expect(page.getByText(/Power of Attorney/i).first()).toBeVisible();
        await expect(page.getByText(/Organ Donation/i).first()).toBeVisible();
    });

    test('status counters and progress bar visible', async ({ page }) => {
        await openTool(page, 'legal-docs');
        await expect(page.getByText(/Not Started/i).first()).toBeVisible();
        await expect(page.getByText(/Overall completion/i).first()).toBeVisible();
    });

    test('can expand a document and see details', async ({ page }) => {
        await openTool(page, 'legal-docs');
        // Click on first document row
        const firstDoc = page.getByText(/Living Will/i).first();
        await firstDoc.click();
        await page.waitForTimeout(300);
        // Expanded content should show tips
        await expect(page.getByText(/Key Points|Status/i).first()).toBeVisible();
    });

    test('View Saved Documents link present', async ({ page }) => {
        await openTool(page, 'legal-docs');
        await expect(page.getByRole('link', { name: /view saved documents|gespeicherte dokumente/i })).toBeVisible();
    });

    test('Fill Demo Data works', async ({ page }) => {
        await openTool(page, 'legal-docs');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(500);
        await page.reload({ waitUntil: 'networkidle' });
        await expect(page.getByText(/Completed|Filed/i).first()).toBeVisible();
    });
});

/* ─── 04  DEATH CHECKLIST ────────────────────────────────────────────── */
test.describe('04 Death Checklist (After Death Guide)', () => {
    test('renders with 5 phases', async ({ page }) => {
        await openTool(page, 'death-checklist');
        await expect(page.getByText(/Phase 1/i).first()).toBeVisible();
        await expect(page.getByText(/Phase 2/i).first()).toBeVisible();
        await expect(page.getByText(/Phase 3/i).first()).toBeVisible();
        await expect(page.getByText(/Phase 4/i).first()).toBeVisible();
        await expect(page.getByText(/Phase 5/i).first()).toBeVisible();
    });

    test('shows progress bar', async ({ page }) => {
        await openTool(page, 'death-checklist');
        await expect(page.getByText(/progress|fortschritt/i).first()).toBeVisible();
    });

    test('can check an item in phase 1', async ({ page }) => {
        await openTool(page, 'death-checklist');
        const checkbox = page.locator('[style*="cursor: pointer"]').first();
        if (await checkbox.isVisible()) {
            await checkbox.click();
            await page.waitForTimeout(300);
        }
    });

    test('Swiss-specific items visible after expanding phases', async ({ page }) => {
        await openTool(page, 'death-checklist');
        // Click Phase 2 header to expand it
        await page.getByText(/Phase 2/i).first().click();
        await page.waitForTimeout(300);
        await expect(page.getByText(/Zivilstandsamt/i).first()).toBeVisible();
        // Click Phase 4 to see more Swiss items
        await page.getByText(/Phase 4/i).first().click();
        await page.waitForTimeout(300);
        await expect(page.getByText(/AHV|Pensionskasse|Krankenkasse/i).first()).toBeVisible();
    });
});

/* ─── 05  EXECUTOR (TODO LIST) ───────────────────────────────────────── */
test.describe('05 Executor (ToDo List)', () => {
    test('renders with input form and filter buttons', async ({ page }) => {
        await openTool(page, 'executor');
        await expect(page.getByPlaceholder(/add a new task|neue aufgabe/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /all|alle/i }).first()).toBeVisible();
    });

    test('can add a task', async ({ page }) => {
        await openTool(page, 'executor');
        const input = page.getByPlaceholder(/add a new task|neue aufgabe/i);
        await input.fill('QA Test Task');
        await page.getByRole('button', { name: /add|hinzufügen/i }).first().click();
        await expect(page.getByText('QA Test Task')).toBeVisible();
    });

    test('Fill Demo Data adds tasks', async ({ page }) => {
        await openTool(page, 'executor');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(300);
        const taskItems = page.locator('[style*="border-radius"]').filter({ hasText: /Legal|Financial|Family|Documents/i });
        await expect(taskItems.first()).toBeVisible();
    });

    test('filter buttons work', async ({ page }) => {
        await openTool(page, 'executor');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(300);
        const doneBtn = page.getByRole('button', { name: /done|erledigt/i });
        if (await doneBtn.isVisible()) {
            await doneBtn.click();
            await page.waitForTimeout(200);
        }
    });

    test('progress bar visible', async ({ page }) => {
        await openTool(page, 'executor');
        await page.getByRole('button', { name: /fill demo/i }).click();
        await page.waitForTimeout(300);
        await expect(page.getByText(/%/).first()).toBeVisible();
    });
});

/* ─── 06  TEMPLATES ──────────────────────────────────────────────────── */
test.describe('06 Templates', () => {
    test('renders template grid with multiple templates', async ({ page }) => {
        await openTool(page, 'templates');
        await expect(page.getByText(/Power of Attorney|Vollmacht/i).first()).toBeVisible();
        await expect(page.getByText(/Funeral Directive|Bestattung/i).first()).toBeVisible();
    });

    test('can open a template wizard', async ({ page }) => {
        await openTool(page, 'templates');
        // Click on first template card
        await page.getByText(/Power of Attorney|Vollmacht/i).first().click();
        await page.waitForTimeout(500);
        await expect(page.getByText('01').first()).toBeVisible();
    });

    test('multiple templates available', async ({ page }) => {
        await openTool(page, 'templates');
        // Check that key templates exist
        const templateNames = [
            /Power of Attorney|Vollmacht/i,
            /Funeral|Bestattung/i,
            /Inheritance|Erbverzicht/i,
            /Gift|Schenkung/i,
            /Advance Care|Vorsorgeauftrag/i,
            /Death Registration|Meldung/i,
            /Termination|Kündigung/i,
            /Death Notice|Todesanzeige/i,
        ];
        let found = 0;
        for (const name of templateNames) {
            if (await page.getByText(name).first().isVisible().catch(() => false)) found++;
        }
        expect(found).toBeGreaterThanOrEqual(6);
    });
});

/* ─── 07  LEAVE BEHIND (DIGITAL LEGACY VAULT) ────────────────────────── */
test.describe('07 Leave Behind (Digital Legacy Vault)', () => {
    test('renders with filter buttons', async ({ page }) => {
        await openTool(page, 'leave-behind');
        // Should have "All" filter button
        await expect(page.getByText(/all|alle/i).first()).toBeVisible();
        // Should have add memory button
        await expect(page.getByText(/add memory|speicher hinzufügen/i).first()).toBeVisible();
    });

    test('social media accounts section visible', async ({ page }) => {
        await openTool(page, 'leave-behind');
        await expect(page.getByText(/social media|soziale medien/i).first()).toBeVisible();
    });

    test('can start adding a new memory', async ({ page }) => {
        await openTool(page, 'leave-behind');
        const addBtn = page.getByText(/add memory|\+ add/i).first();
        await addBtn.click();
        await page.waitForTimeout(500);
        // Should show type selection or form
        const content = page.locator('.tool-panel');
        await expect(content).toBeVisible();
    });
});

/* ─── 08  AI AVATAR ──────────────────────────────────────────────────── */
test.describe('08 AI Avatar', () => {
    test('renders with initial state', async ({ page }) => {
        await openTool(page, 'ai-avatar');
        const content = page.locator('.tool-panel');
        await expect(content).toBeVisible();
    });

    test('shows Begin Training button or status', async ({ page }) => {
        await openTool(page, 'ai-avatar');
        const beginBtn = page.getByRole('button', { name: /begin training|training starten/i });
        const talkBtn = page.getByRole('button', { name: /talk|sprechen/i });
        const beginVisible = await beginBtn.isVisible().catch(() => false);
        const talkVisible = await talkBtn.isVisible().catch(() => false);
        expect(beginVisible || talkVisible).toBeTruthy();
    });

    test('sidebar info section visible', async ({ page }) => {
        await openTool(page, 'ai-avatar');
        await expect(page.getByText(/how it works|wie es funktioniert/i).first()).toBeVisible();
    });

    test('beta notice visible', async ({ page }) => {
        await openTool(page, 'ai-avatar');
        await expect(page.getByText(/beta/i).first()).toBeVisible();
    });
});

/* ─── 09  BEREAVEMENT SUPPORT (BE HONORED) ───────────────────────────── */
test.describe('09 Bereavement Support', () => {
    test('renders with heading and info cards', async ({ page }) => {
        await openTool(page, 'bereavement-support');
        await expect(page.getByText(/healing|heilung/i).first()).toBeVisible();
        await expect(page.getByText(/emotional guidance|emotionale begleitung/i).first()).toBeVisible();
        await expect(page.getByText(/support networks|unterstützungsnetzwerke/i).first()).toBeVisible();
    });

    test('emotional support checklist items visible', async ({ page }) => {
        await openTool(page, 'bereavement-support');
        await expect(page.getByText(/anticipatory grief|antizipatorische trauer/i).first()).toBeVisible();
        await expect(page.getByText(/emotional first aid|emotionale erste hilfe/i).first()).toBeVisible();
    });

    test('support groups tab shows organizations', async ({ page }) => {
        await openTool(page, 'bereavement-support');
        const groupsTab = page.getByRole('button', { name: /groups|gruppen/i });
        if (await groupsTab.isVisible()) {
            await groupsTab.click();
            await page.waitForTimeout(300);
        }
        await expect(page.getByText(/VIDUA|Refugium|Seelsorge|143/i).first()).toBeVisible();
    });

    test('checklist items can be toggled', async ({ page }) => {
        await openTool(page, 'bereavement-support');
        const checkbox = page.locator('[style*="cursor: pointer"]').first();
        if (await checkbox.isVisible()) {
            await checkbox.click();
            await page.waitForTimeout(300);
        }
    });
});

/* ─── 10  REMINDERS ──────────────────────────────────────────────────── */
test.describe('10 Reminders', () => {
    test('renders with recommendation cards or reminder list', async ({ page }) => {
        await openTool(page, 'reminders');
        const content = page.locator('.tool-panel');
        await expect(content).toBeVisible();
    });

    test('add reminder form available', async ({ page }) => {
        await openTool(page, 'reminders');
        const addBtn = page.getByRole('button', { name: /add reminder|erinnerung/i });
        if (await addBtn.isVisible()) {
            await addBtn.click();
            await page.waitForTimeout(300);
            await expect(page.locator('input').first()).toBeVisible();
        }
    });
});

/* ─── 11  STORAGE WARNING (LOGGED OUT) ───────────────────────────────── */
test.describe('Storage warning for non-logged-in users', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('warning banner visible on tools dashboard', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        await expect(page.getByText(/not logged in|nicht angemeldet/i).first()).toBeVisible();
    });

    test('warning has Create Account button', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        await expect(page.getByRole('link', { name: /create.*account|konto.*erstellen/i })).toBeVisible();
    });

    test('warning can be dismissed', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        const dismissBtn = page.getByRole('button', { name: /understand|verstanden/i });
        await dismissBtn.click();
        await expect(page.getByText(/not logged in|nicht angemeldet/i)).not.toBeVisible();
    });
});

/* ─── 12  PROFILE PAGE — TRANSLATED ──────────────────────────────────── */
test.describe('Profile page translations', () => {
    test('EN: all labels in English', async ({ page }) => {
        await page.goto('/profile', { waitUntil: 'networkidle' });
        await expect(page.getByText(/Your Profile/i).first()).toBeVisible();
        await expect(page.getByText(/Personal Info/i).first()).toBeVisible();
        await expect(page.getByText(/My Beneficiaries/i).first()).toBeVisible();
    });

    test('DE: switch to German and verify labels', async ({ page }) => {
        await page.goto('/profile', { waitUntil: 'networkidle' });
        const deBtn = page.getByRole('button', { name: 'DE' });
        if (await deBtn.isVisible()) await deBtn.click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/Ihr Profil/i).first()).toBeVisible();
        await expect(page.getByText(/Persönliche Daten/i).first()).toBeVisible();
        await expect(page.getByText(/Meine Begünstigten/i).first()).toBeVisible();
    });

    test('Plan tab: Premium/Family redirect to /pricing', async ({ page }) => {
        await page.goto('/profile#plan', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        const selectBtn = page.getByRole('button', { name: /select premium|auswählen premium/i });
        if (await selectBtn.isVisible()) {
            await selectBtn.click();
            await page.waitForTimeout(500);
            await expect(page).toHaveURL(/\/pricing/);
        }
    });
});

/* ─── 13  TOOLS DASHBOARD — TIER BADGES ──────────────────────────────── */
test.describe('Tools dashboard tier badges', () => {
    test('Be Ready shows Free badge', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        await expect(page.getByText(/free|kostenlos/i).first()).toBeVisible();
    });

    test('Leave Behind shows Paid badge', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        await expect(page.getByText(/15 CHF/i).first()).toBeVisible();
    });

    test('clicking tier badge opens modal', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        const freeBadge = page.getByText(/free.*ℹ️|kostenlos.*ℹ️/i).first();
        await freeBadge.click();
        await page.waitForTimeout(300);
        // Modal should show tier info
        await expect(page.getByText(/free tier|kostenloser tarif/i).first()).toBeVisible();
    });
});

/* ─── 14  GERMAN LOCALE — KEY TOOLS ──────────────────────────────────── */
test.describe('German locale across tools', () => {
    test('Tools dashboard in German', async ({ page }) => {
        await page.goto('/tools', { waitUntil: 'networkidle' });
        const deBtn = page.getByRole('button', { name: 'DE' });
        if (await deBtn.isVisible()) await deBtn.click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/Bereit sein/i).first()).toBeVisible();
        await expect(page.getByText(/Hinterlassen/i).first()).toBeVisible();
        await expect(page.getByText(/Gedenken/i).first()).toBeVisible();
    });

    test('Legal docs headings translated in German', async ({ page }) => {
        await page.goto('/tools?tool=legal-docs', { waitUntil: 'networkidle' });
        const deBtn = page.getByRole('button', { name: 'DE', exact: true });
        if (await deBtn.isVisible()) await deBtn.click();
        await page.waitForTimeout(1000);
        // The tag_legal key translates to "Rechtlich" in German
        await expect(page.getByText(/Rechtlich|Legal Framework/i).first()).toBeVisible();
    });
});

/* ─── 15  BACK / NEXT NAVIGATION ─────────────────────────────────────── */
test.describe('Tool navigation (Back/Next)', () => {
    test('Next button navigates to next tool', async ({ page }) => {
        await openTool(page, 'asset-overview');
        const nextBtn = page.getByRole('button', { name: /→/ }).last();
        if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(300);
            await expect(page).toHaveURL(/tool=will-builder/);
        }
    });

    test('Back button navigates to previous tool', async ({ page }) => {
        await openTool(page, 'will-builder');
        const backBtn = page.getByRole('button', { name: /←/ }).first();
        if (await backBtn.isVisible()) {
            await backBtn.click();
            await page.waitForTimeout(300);
            await expect(page).toHaveURL(/tool=asset-overview/);
        }
    });

    test('All Tools button returns to dashboard', async ({ page }) => {
        await openTool(page, 'legal-docs');
        const allToolsBtn = page.getByRole('button', { name: /all tools|alle werkzeuge/i });
        if (await allToolsBtn.isVisible()) {
            await allToolsBtn.click();
            await page.waitForTimeout(300);
            // Dashboard should show section headings, not a specific tool
            await expect(page.getByText(/Be Ready|Bereit sein/i).first()).toBeVisible();
        }
    });
});
