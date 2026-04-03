# CLAUDE.md — Project Instructions

## Testing
- **Always verify UI changes with Playwright E2E tests** before considering a task done.
- Run `npx playwright test` to execute the full test suite.
- Run `npx playwright test tests/<file>.spec.ts` for specific test files.
- Tests run against the deployed site: `https://readylegacy.pages.dev`
- Auth setup creates a test account automatically via `tests/auth-setup.ts`.

## Deployment
- Build: `npm run build`
- Deploy: `npx wrangler pages deploy dist --project-name=readylegacy --branch=main --commit-dirty=true`
- Always build + deploy after code changes, then verify with Playwright.

## Translation keys
- Always add new translation keys to both `public/assets/locales/en.json` and `de.json`.
- Test the UI to make sure raw keys (e.g. `tools_your_tools`) are not displayed.
