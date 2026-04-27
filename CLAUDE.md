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

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **ReadyLegacy** (1559 symbols, 2230 relationships, 49 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/ReadyLegacy/context` | Codebase overview, check index freshness |
| `gitnexus://repo/ReadyLegacy/clusters` | All functional areas |
| `gitnexus://repo/ReadyLegacy/processes` | All execution flows |
| `gitnexus://repo/ReadyLegacy/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Tools area (44 symbols) | `.claude/skills/generated/tools/SKILL.md` |
| Work in the Pages area (43 symbols) | `.claude/skills/generated/pages/SKILL.md` |
| Work in the _lib area (40 symbols) | `.claude/skills/generated/lib/SKILL.md` |
| Work in the Auth area (8 symbols) | `.claude/skills/generated/auth/SKILL.md` |
| Work in the Api area (8 symbols) | `.claude/skills/generated/api/SKILL.md` |
| Work in the Components area (7 symbols) | `.claude/skills/generated/components/SKILL.md` |
| Work in the User-data area (6 symbols) | `.claude/skills/generated/user-data/SKILL.md` |
| Work in the Tests area (5 symbols) | `.claude/skills/generated/tests/SKILL.md` |

<!-- gitnexus:end -->
