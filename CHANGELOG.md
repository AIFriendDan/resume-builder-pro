# Changelog

## [v1.1.1] — 2026-07-21

**Task:** SP-RB-01 verification pass — confirm the 2026-07-10 implementation (v1.1.0) actually works, not just that it was committed. No code changes; QA only.
**Branch:** none (verified against `main`; the `sp-rb-01-movable-sections` branch on origin is identical to `main`, safe to delete)
**Status:** Verified — all 7 acceptance items pass; production deployment confirmed live

**What was checked (dev server, real interaction, not code-only):**
1. Drag-to-reorder: simulated a real pointer drag (dnd-kit PointerSensor) dragging Experience over Summary. Confirmed via dnd-kit's own a11y announcement ("Draggable item summary was dropped over droppable area experience") and visible reorder in both the sidebar and Live Preview simultaneously.
2. Identity stayed pinned at position 0 throughout — no drag handle rendered for it, unaffected by the Summary/Experience swap.
3. Refresh persistence: reloaded the page after the drag: Experience/Summary order held, confirming it's real `localStorage` auto-save, not just React state.
4. Additional Links: clicked "+ Add Link", filled Label="GitHub"/URL="github.com/dangarza". Confirmed it rendered in the Live Preview contact block (`linkedin.com/... | github.com/dangarza`) with `https://` auto-prepended on the href and protocol stripped for display text.
5. Empty state: confirmed the pre-link layout showed no extra separator/line — matches "zero visual change" requirement.
6. ATS Tailor: read `applyTailoring()` (`ResumeBuilder.tsx:362-374`) — it spreads `{ ...resumeData }` and only overwrites `summary`/appends `skills`; `sectionOrder` and `additionalLinks` pass through untouched. No snap-back risk.
7. Export freshness: triggered the real Word export (`exportToWord`) by intercepting `URL.createObjectURL` and reading the generated Blob — confirmed it contained the GitHub link and had Experience before Summary in the exported HTML, proving it reads the live `#resume-preview` DOM at click time, not a stale copy. PDF export uses the same `#resume-preview` DOM via print CSS (`exportToPDF`), so the same guarantee applies structurally; couldn't capture actual print dialog output in this environment.

**Also checked (out of sprint scope, per Dan's request):**
- Production status: `resume.aifrienddan.com` returns HTTP 200 and Vercel shows a Ready production deployment from ~11 days ago. The earlier "live: false" flag was stale/wrong, not a real issue.
- Found: the Vercel MCP connector (scoped to team `hchy`) returns zero projects for this repo, even though the `vercel` CLI (same `hchy` scope, logged in as `dangarza-1031`) sees it fine — likely a stale/mismatched MCP auth token, separate from this sprint.

**Environment note:** the Browser pane's visual/pointer-click automation (`computer` tool: screenshot, click, drag) was non-functional this session ("pane not displayed, not compositing frames"). Worked around it by dispatching real `PointerEvent`/`Event` sequences directly via the JS console against the live page — this exercises the actual dnd-kit sensors and React input handlers (not internal state mutation), so it's a legitimate substitute, but it's less conclusive than an actual mouse-driven click test. Recommend a manual once-over in a real browser if that's easy for Dan to do.

**Files touched:** `CHANGELOG.md` only.

**Commands run (PowerShell — `C:\Users\danimal\Documents\project_workspace\resume-builder-pro`):**
```
vercel ls resume-builder-pro
vercel domains inspect resume.aifrienddan.com
Invoke-WebRequest https://resume.aifrienddan.com
```
Dev server run via Claude Browser's `preview_start` (npm run dev -p 3411), stopped at end of session.

**Decisions made:**
- Did not delete the redundant `sp-rb-01-movable-sections` branch (identical to `main`) — flagging for Dan to clean up rather than acting unilaterally on a repo branch.

**Follow-ups:**
- Dan: confirm/reauthorize the Vercel MCP connector if you want Claude to query this project's deployments without shelling out to the CLI.
- Consider a real manual drag-and-drop click-test next time a browser session with working visual automation is available, to fully close out the one soft spot from the original 2026-07-10 session.

## [v1.1.0] — 2026-07-10

**Task:** SP-RB-01 — Movable Sections + Additional Links (sprint pack) + AI provider migration
**Branch:** `sp-rb-01-movable-sections`
**Status:** Implemented, build-verified, partially UI-verified (browser automation tool failed mid-session; drag-and-drop itself not click-tested, keyboard/pointer wiring confirmed present via dnd-kit)

**What changed:**
- Part A — Drag-and-drop résumé section reordering via `@dnd-kit`. `Identity` pinned to position 0 (locked, non-draggable, shown with a lock icon). New `sectionOrder: SectionId[]` field drives the sidebar order, step numbering, "Continue to →" navigation, and all three résumé templates (Modern/Classic/ATS) — each template now maps over `sectionOrder` instead of hardcoding section sequence, so Live Preview/PDF/Word all stay in sync (PDF and Word both export the same rendered preview DOM, so fixing the preview's render order was sufficient for all three outputs). Order persists through the existing `localStorage` auto-save path and is normalized on every load (`normalizeSectionOrder`) to handle legacy data missing the field.
- Part B — "Additional Links" repeater in the Identity tab (GitHub, portfolio, etc.), below LinkedIn. Label + URL per row, quick-pick label suggestions via `<datalist>`, incomplete rows silently skipped in render/export. Links render in the contact block across all three templates, hyperlinked (`https://` prepended for `href`, protocol stripped for display text), matching the existing LinkedIn display style.
- AI provider migration — the four AI routes (`/api/enhance`, `/api/import`, `/api/tailor`, `/api/cover-letter`) were on Groq-hosted Llama models via the `openai` SDK pointed at Groq's base URL. Migrated to native Anthropic Claude (`@anthropic-ai/sdk`, model `claude-haiku-4-5` — Dan's choice, closest cost/speed match to the prior Groq usage). `/api/import` and `/api/tailor` (which need structured JSON) now use `output_config.format: json_schema` for guaranteed-valid schema-conformant output instead of prompt-and-hope JSON parsing. Removed the now-unused `openai` package.

**Files touched:**
- `components/ResumeBuilder.tsx` — sectionOrder/additionalLinks data model, dnd-kit sidebar, template render-contract refactor, Identity form links repeater
- `components/icons.tsx` — added `GripVertical`, `Lock` icons
- `lib/sections.ts` (new) — `SectionId`, `DEFAULT_SECTION_ORDER`, `SECTION_META`, `normalizeSectionOrder`
- `lib/anthropic.ts` (new) — shared Anthropic client, model constant, text-extraction helper
- `app/api/enhance/route.js`, `app/api/import/route.ts`, `app/api/tailor/route.ts`, `app/api/cover-letter/route.ts` — migrated OpenAI/Groq → Anthropic Claude
- `.env.example` — added `ANTHROPIC_API_KEY`
- `package.json` / `package-lock.json` — added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `@anthropic-ai/sdk`; removed `openai`

**Commands run (bash — repo root `C:\Users\danimal\Documents\project_workspace\resume-builder-pro`):**
```
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @anthropic-ai/sdk
npm uninstall openai
npx prisma generate
npx next build   (verified clean, both before and after the Claude migration)
npx next dev -p 3411   (manual smoke test)
```

**Decisions made:**
- Discovery (Task 0): everything lives in one file, `components/ResumeBuilder.tsx` (~1080 lines) — sidebar, central state, live preview, PDF/Word export, and the Identity form are all in this single component. **STOP condition triggered**: the three résumé templates (Modern/Classic/ATS) each hardcoded their own section sequence with no shared abstraction — refactored per Task 3's render contract before proceeding.
- PDF/Word export already work by capturing whatever is currently rendered in `#resume-preview` (`window.print()` and an `innerHTML` clone, respectively) — so there was no separate PDF/Word renderer to update; fixing the Live Preview template's render order was sufficient to satisfy "Preview, PDF, and Word all map over [sectionOrder]."
- The existing `/api/save` route (Prisma `Resume` model, `content: Json`) is not called anywhere in `ResumeBuilder.tsx` — the actual "auto-save path" referenced in the sprint pack is `localStorage`. Wired `sectionOrder`/`additionalLinks` into that path; left `/api/save` alone (out of scope, appears to be a stub for a future account-based save feature).
- AI model choice (Haiku 4.5 vs Sonnet 5 vs Opus 4.8) was ambiguous from the sprint pack, so asked Dan directly given the cost spread ($1/$5 vs $3/$15 vs $5/$25 per MTok) — he chose Haiku 4.5.
- Structured JSON output for `/api/import` and `/api/tailor` uses Claude's native `output_config.format: json_schema` rather than a prompt-only "return JSON" instruction — stronger guarantee than the prior Groq/OpenAI `response_format: json_object` approach.
- **Bug found + fixed during manual QA**: the Additional Links label input's `w-40` width class was losing to the shared `inp` constant's `w-full` (Tailwind class-order conflict), squeezing the URL input down to a sliver. Fixed with an `!w-40` important-modifier.

**Follow-ups:**
- Live drag-and-drop was not click-verified — the Claude-in-Chrome browser automation tool errored (`Cannot access a chrome-extension:// URL of different extension`) partway through QA, and the session hit its 5-hour rate limit before it could be retried. Keyboard accessibility wiring (dnd-kit's `aria-describedby`/`useSortable`) is confirmed present in the rendered DOM; Add-Link, order-derived step labels, link persistence through reload, and PDF/Word-via-preview were all confirmed working. **Dan should manually drag a section in the browser once before merging** to close this out.
- A dev-only React hydration console warning (`aria-describedby` id mismatch, "DndDescribedBy-1" vs "DndDescribedBy-0") appeared once — this is a known dnd-kit SSR/React-StrictMode id-counter quirk, not a functional bug (no visible breakage, only a console warning in dev mode). Not investigated further; flagging in case it recurs.
- Dan asked mid-session to also check whether the AI Tailor feature reads `sectionOrder` — it doesn't need to: `applyTailoring()` only overwrites `summary` and appends to `skills` (both spread from `{ ...resumeData }`), so `sectionOrder` and `additionalLinks` pass through untouched. Confirmed no snap-back-to-default-order risk.
- `ANTHROPIC_API_KEY` needs to be set in both local `.env.local` and the Vercel project's environment variables before AI features (`enhance`, `import`, `tailor`, `cover-letter`) will work in this branch — none of them were live-tested against a real key this session.
- Out of scope (per sprint pack, parked): section show/hide toggles, per-template order presets, reordering items within a section, reordering the links themselves.
