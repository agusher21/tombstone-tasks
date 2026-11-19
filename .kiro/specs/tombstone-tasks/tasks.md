# Tombstone Tasks — Implementation Tasks

## Task Dependency Graph

```
Wave 1 (Foundation)
  └─► Wave 2 (Core Features)
        └─► Wave 3 (Spooky Polish + Hardening)
              └─► Wave 4 (Verification)
```

Wave 1 tasks have no dependencies and can run in parallel with each other. Each subsequent wave depends on all tasks in the prior wave being complete.

---

## Wave 1 — Foundation

> No dependencies. All four tasks can be implemented in parallel.

- [ ] 1. Create `index.html` shell with semantic structure and dialogs
  - Write `index.html` with `<!DOCTYPE html>`, `lang="en"`, `<meta charset="UTF-8">`, and `<meta name="viewport">`. Add a `<header>` containing the app title and `<div id="bat-container" aria-hidden="true">`. Add `<main>` containing: `<div id="stats-bar" role="status">`, `<div id="filter-controls">`, `<section id="graveyard-active" aria-live="polite" aria-label="Active tasks">`, and `<section id="graveyard-buried" aria-label="Buried tasks">`. Add a `<form id="add-task-form">` with an accessible title input, optional date input, haunting-level radio fieldset (low/medium/high), and a "Plant Tombstone" submit button. Add `<dialog id="epitaph-dialog">`, `<dialog id="edit-dialog">`, and `<dialog id="confirm-dialog">` as empty placeholders. Add `<link rel="stylesheet" href="style.css">` and `<script src="app.js" defer></script>`. Include a `.sr-only` class definition in a `<style>` block or rely on style.css. No external resources.
  - Implements Requirement 2 (app shell, semantic structure for tombstone rendering), Requirement 9 (ARIA landmarks, accessibility baseline).

- [ ] 2. Create `style.css` with `--tt-*` palette tokens and base layout
  - In `:root`, define all ten CSS custom properties: `--tt-bg: #0d0d0f`, `--tt-surface: #1a1a1f`, `--tt-bone: #e8e4d9`, `--tt-bone-dim: #a09a8e`, `--tt-green: #4a7c59`, `--tt-green-glow: #6db88a`, `--tt-blood: #8b1a1a`, `--tt-blood-bright: #c0392b`, `--tt-moon: #f5e6a3`, `--tt-fog: rgba(180,200,180,0.08)`. Set `body { background: var(--tt-bg); color: var(--tt-bone); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }`. Add `.sr-only` rule (position absolute, 1px clip). Add a universal focus ring: `*:focus-visible { outline: 2px solid var(--tt-green-glow); outline-offset: 2px; }`. Add `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`. Define monospace style for `.epitaph { font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace; font-style: italic; }`.
  - Implements Requirement 2 (palette tokens, tombstone appearance), Requirement 9 (focus rings, WCAG AA contrast, reduced-motion), Requirement 3 (bury animation keyframes).

- [ ] 3. Create `app.js` with the `store` object and localStorage I/O
  - Write `app.js` as a single IIFE `(function () { ... })()`. Inside, define the `store` object as the sole global-equivalent state container with: `tasks` (array), `filter` (string, default `'all'`), `load()` (reads `localStorage.getItem('tombstone-tasks')`, JSON-parses, falls back to `[]` when the key is missing, the value is corrupt, the parsed result is not an object, or its `tasks` field is not an array), `save()` (serializes `JSON.stringify({ tasks: store.tasks })` to `localStorage.setItem('tombstone-tasks', ...)`), and `generateId()` (returns a unique string, e.g. `Date.now().toString(36) + Math.random().toString(36).slice(2)`). Call `store.load()` at the bottom of the IIFE. No `eval()`. Never assign raw user input to `innerHTML`; use `textContent` or `createElement`.
  - Implements Requirement 8 (localStorage persistence, offline-first), Requirement 1 (task data model and store initialization), acceptance criteria 1–7.

- [ ] 4. Create `smoke-test.mjs` skeleton with Playwright setup
  - Write `smoke-test.mjs` as a plain ESM script (no default export). Import `chromium` from `'playwright'`. Wrap execution in a `try/finally` that calls `browser.close()`. Launch Chromium headless, open `index.html` via its absolute `file://` path (use `new URL('index.html', import.meta.url).href`). Add a single placeholder assertion: `await page.waitForSelector('body')` followed by `console.log('smoke: page loaded OK')`. The script must exit 0 on success and non-zero on any unhandled rejection.
  - Implements Requirement 10 (test harness skeleton, file:// compatibility), acceptance criteria 1–2.

---

## Wave 2 — Core Features

> Depends on Wave 1. Within this wave, tasks 5–7 can run together, 8 depends on 6, 9 depends on 8, 10–11 depend on 6, 12–13 depend on 6.

- [ ] 5. Implement the add-task form with client-side validation
  - In `app.js`, add a `submit` listener on `#add-task-form`. Read and trim the title input; if empty, focus the input and return early. Read the optional due-date input and the checked haunting-level radio. Create a task object: `{ id: store.generateId(), title, dueDate: dueDate || null, hauntingLevel, createdAt: new Date().toISOString(), buried: false, epitaph: null, buriedAt: null }`. Push to `store.tasks`, call `store.save()`, call `renderAll()`, and reset the form. Prevent default form submission.
  - Implements Requirement 1 (task creation with title, due date, haunting level, validation, and unique ID), acceptance criteria 1–7.

- [ ] 6. Render tombstone cards for active tasks
  - In `app.js`, write `renderTasks()`. Clear `#graveyard-active`. For each task where `buried === false` (applying `store.filter`), create an `<article class="tombstone-card" data-id="...">` using `createElement`. Inside add: an `<h2>` with `textContent = task.title`, a due-date `<p>` (if set), a haunting-level `<span class="haunting-badge haunting-{level}">` with `textContent`, a "Bury" `<button>` with `aria-label="Bury: {title}"`, and an "Edit" `<button>` with `aria-label="Edit: {title}"`. Append the card to `#graveyard-active`. Call `renderTasks()` from a `renderAll()` function that also calls `renderGraveyard()`, `renderStats()`, and `renderBats()`.
  - Implements Requirement 2 (tombstone card rendering: title, due date, haunting level, palette tokens, bat decorations), acceptance criteria 1–8.

- [ ] 7. Style tombstone cards in `style.css`
  - Add `.tombstone-card { background: var(--tt-surface); border: 1px solid var(--tt-green); border-radius: 50% 50% 0 0 / 30% 30% 0 0; position: relative; padding: 1.5rem 1rem 1rem; }`. Add `@media (prefers-reduced-motion: no-preference) { .tombstone-card { transition: opacity 300ms ease, transform 300ms ease; } }`. Add badge styles: `.haunting-badge { display: inline-block; padding: 0.15em 0.5em; border-radius: 3px; font-size: 0.75rem; }`, `.haunting-low { border-left: 3px solid var(--tt-green); }`, `.haunting-medium { border-left: 3px solid #c8a020; }`, `.haunting-high { border-left: 3px solid var(--tt-blood-bright); }`. Ensure card buttons have visible focus rings via the universal rule set in task 2.
  - Implements Requirement 2 (tombstone card appearance, palette tokens, haunting-level CSS classes), acceptance criteria 7–8.

- [ ] 8. Implement burial flow — epitaph dialog and bury animation
  - In `app.js`, wire the "Bury" button click to: populate `<dialog id="epitaph-dialog">` with a `<textarea id="epitaph-input" placeholder="They finally replied to that email">`, a "Confirm" button, and a "Skip" button (using `innerHTML` on the dialog content div is acceptable here since the content is static markup, not user data). Call `dialog.showModal()` and set `autofocus` on `#epitaph-input`. On "Confirm", read textarea value. On "Skip", pick a line from a hardcoded array of ≥5 wry epitaphs. Set `task.buried = true`, `task.epitaph = text`, `task.buriedAt = new Date().toISOString()`. Add class `is-burying` to the card element, then on `transitionend` (or `animationend`): call `store.save()`, call `renderAll()`. Close the dialog with `dialog.close()` before triggering the animation.
  - Implements Requirement 3 (burial flow: epitaph dialog, bury animation, buried state, auto-generated epitaph), acceptance criteria 1–9.

- [ ] 9. Render the Graveyard (buried tasks) section
  - In `app.js`, write `renderGraveyard()`. Clear `#graveyard-buried`. For each task where `buried === true` (applying `store.filter`), create a card `<article class="tombstone-card is-buried" data-id="...">` with: title `<h2>`, epitaph `<p class="epitaph">`, buried date `<p>`, and a "Delete" `<button aria-label="Delete: {title}">`. Append to `#graveyard-buried`. In `style.css`, add `.is-buried { opacity: 0.55; transform: translateY(8px); }`.
  - Implements Requirement 3 (buried tombstone rendering: sunken appearance, epitaph in monospace italic, graveyard section), acceptance criteria 7–8.

- [ ] 10. Build the stats bar
  - In `app.js`, write `renderStats()`. Compute: `buriedCount` = tasks where `buried === true`. `aliveCount` = tasks where `buried === false`. `streak` = consecutive calendar days ending today (or yesterday) on which at least one task has a `buriedAt` date, counting backwards until a day with no burials is found. Update `#stats-bar` textContent with all three values. Render a moon glyph `<span id="moon-glyph" aria-hidden="true">🌕</span><span class="sr-only">Streak moon</span>` next to the streak value. Set `document.documentElement.style.setProperty('--tt-streak', Math.min(streak, 10))` for brightness scaling.
  - Implements Requirement 4 (stats bar: buried count, alive count, survival streak, moon glyph brightness), acceptance criteria 1–7.

- [ ] 11. Implement filter controls (All / Alive / Buried)
  - In `app.js` (or `index.html`), render three `<button>` elements inside `#filter-controls` with text "All", "Alive", "Buried". Wire click handlers: set `store.filter` to `'all'`, `'alive'`, or `'buried'` respectively; call `renderAll()`. In `renderTasks()` and `renderGraveyard()`, skip tasks that don't match the active filter. After each filter change, update `aria-pressed="true"` on the active button and `aria-pressed="false"` on the others. In `style.css`, add an active style: `[aria-pressed="true"] { background: var(--tt-green); color: var(--tt-bone); }`.
  - Implements Requirement 5 (All/Alive/Buried filters, default to All, aria-pressed state), acceptance criteria 1–6.

- [ ] 12. Implement edit task dialog
  - In `app.js`, wire the "Edit" button on each active card to: populate `<dialog id="edit-dialog">` with a form pre-filled with `task.title`, `task.dueDate`, and `task.hauntingLevel` (check the matching radio). Call `dialog.showModal()` with `autofocus` on the title input. On submit, validate the title (non-empty after trim), update the task object in `store.tasks`, call `store.save()`, `dialog.close()`, and `renderAll()`. On a "Cancel" button, call `dialog.close()` only.
  - Implements Requirement 6 (edit task: pre-populated dialog, validation, persist on save, cancel without change), acceptance criteria 1–4.

- [ ] 13. Implement delete task with confirmation dialog
  - In `app.js`, wire the "Delete" button on buried cards to: set a data attribute on `<dialog id="confirm-dialog">` with the task ID, populate a message `<p>` with `textContent = 'Delete "' + task.title + '"?'`, and call `dialog.showModal()`. On "Confirm" button click, find the task by ID, remove it from `store.tasks`, call `store.save()`, `dialog.close()`, and `renderAll()`. On "Cancel", call `dialog.close()` only.
  - Implements Requirement 6 (delete with confirmation prompt, remove from store, cancel without change), acceptance criteria 5–8.

---

## Wave 3 — Spooky Polish + Hardening

> Depends on Wave 2. Tasks 14–16 form a cluster; 17–18 are independent; 19–21 are independent.

- [ ] 14. Implement risen (overdue) detection and apply CSS class
  - In `app.js`, write `isOverdue(task)`: returns `true` when `task.dueDate` is a non-empty string, `task.buried === false`, and `task.dueDate < todayString` (where `todayString` is `new Date().toISOString().slice(0,10)`). In `renderTasks()`, after creating each active card element, if `isOverdue(task)` is true add class `is-risen` and append a warning element: `<span aria-hidden="true" class="risen-icon">⚠️</span><span class="sr-only">Overdue</span>`.
  - Implements Requirement 7 (risen/overdue detection, zombie class, warning icon with aria-hidden and sr-only), acceptance criteria 1–2.

- [ ] 15. Add risen fog overlay, crack pattern, and warning styling in `style.css`
  - Add `.is-risen { --tt-fog-local: rgba(180,200,180,0.08); }`. Add `.is-risen::before { content: ""; position: absolute; inset: 0; background: var(--tt-fog); pointer-events: none; border-radius: inherit; }`. Add `.is-risen { box-shadow: inset 0 0 0 2px var(--tt-blood); border-style: dashed; }`. Add `.is-risen h2 { color: var(--tt-blood-bright); }`. Gate the fog float animation with `@media (prefers-reduced-motion: no-preference)`: `.is-risen::before { animation: fog-float 3s ease-in-out infinite; }`. Define `@keyframes fog-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }`. Also define `@keyframes bury-sink { to { transform: translateY(20px); opacity: 0; } }` and apply `.is-burying { animation: bury-sink 400ms ease forwards; }` gated by no-preference.
  - Implements Requirement 7 (fog overlay, crack texture, blood-bright warning text, float animation, motion gating), Requirement 3 (bury animation keyframes and class), acceptance criteria 2–8.

- [ ] 16. Schedule midnight re-evaluation of overdue status
  - In `app.js`, after `store.load()`, compute milliseconds until the next local midnight: `const now = new Date(); const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;`. Call `setTimeout(() => { renderAll(); }, msUntilMidnight)`. This ensures tasks that become overdue as the clock crosses midnight are re-rendered as risen without a page reload.
  - Implements Requirement 7 (overdue re-evaluation at midnight), acceptance criteria 8.

- [ ] 17. Wire bat decorations to alive task count
  - In `app.js`, write `renderBats()`. Compute `aliveCount = store.tasks.filter(t => !t.buried).length`. Clear `#bat-container`. Append `Math.min(aliveCount, 5)` bat elements, each `<span aria-hidden="true" class="bat">🦇</span>`. In `style.css`, add `.bat { display: inline-block; margin: 0 0.25rem; font-size: 1.1rem; }`. Call `renderBats()` from `renderAll()`.
  - Implements Requirement 2 (bat decorations in page header wired to alive count, capped at five), acceptance criteria 2–3.

- [ ] 18. Wire moon glyph brightness to streak length
  - The `--tt-streak` custom property is already set in `renderStats()` (task 10). In `style.css`, add `#moon-glyph { color: var(--tt-moon); filter: brightness(calc(0.5 + var(--tt-streak, 0) * 0.05)); transition: filter 300ms ease; }`. Confirm the moon glyph element carries `aria-hidden="true"` and a sibling `.sr-only` span with text "Streak moon".
  - Implements Requirement 4 (moon glyph brightness scales with streak length), acceptance criteria 5.

- [ ] 19. Implement responsive layout from 320 px to 1920 px
  - In `style.css`, wrap the tombstone cards grid in `main { max-width: 1400px; margin: 0 auto; padding: 0 1rem; }`. Set `#graveyard-active, #graveyard-buried { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; padding: 1rem 0; }`. Set `#add-task-form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 480px; }`. Verify no horizontal scrollbar appears at 320 px viewport width by ensuring all widths use `%`, `fr`, or `max-content` with `overflow-x: hidden` on `body`.
  - Implements Requirement 9 (responsive layout 320 px–1920 px without horizontal scrolling), acceptance criteria 1.

- [ ] 20. Audit keyboard accessibility, ARIA attributes, and WCAG AA contrast
  - Review `index.html` and `app.js`: confirm every `<button>` has either visible text or `aria-label`. Confirm all three `<dialog>` elements set `autofocus` on their first interactive child when opened. Confirm `#stats-bar` has `role="status"`. Confirm `#graveyard-active` has `aria-live="polite"`. Confirm all spooky-icon elements (`bat`, `moon-glyph`, `risen-icon`) carry `aria-hidden="true"`. Check contrast ratios: `--tt-bone` (#e8e4d9) on `--tt-bg` (#0d0d0f) ≈ 16:1 (passes). `--tt-blood-bright` (#c0392b) on `--tt-surface` (#1a1a1f) — verify ≥ 4.5:1; adjust `--tt-blood-bright` to `#e04b3a` if it falls short. Fix any issues found.
  - Implements Requirement 9 (keyboard navigation, Tab/Enter/Space, aria-label on icon-only buttons, dialog autofocus, WCAG AA contrast, aria-hidden on icons with sr-only siblings, English strings, system font stacks), acceptance criteria 2–11.

- [ ] 21. Add seed data for the first-run empty state
  - In `app.js`, after `store.load()`, if `store.tasks.length === 0`, push three sample tasks and call `store.save()`: one active task with haunting level "medium" and a future due date; one buried task with epitaph "They finally replied to that email"; one active task with a past due date (triggering risen styling). These are starter data only and must not contain offensive content.
  - Implements Requirement 8 (initialize store from localStorage, graceful fallback, offline-first persistence), acceptance criteria 2–3.

---

## Wave 4 — Verification

> Depends on Wave 3. Tasks 22–26 expand the smoke test; task 27 runs and fixes it.

- [ ] 22. Expand `smoke-test.mjs` — app load and no-console-error assertion
  - Replace the placeholder assertion with: capture `console.error` calls via `page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); })`. After `page.goto(...)` and `page.waitForSelector('main')`, assert `errors.length === 0` (throw if not). Assert `await page.isVisible('#stats-bar')`. Log "smoke: app load — PASS".
  - Implements Requirement 10 (smoke test: app loads without JS errors), acceptance criteria 1–2.

- [ ] 23. Expand `smoke-test.mjs` — add task appears as tombstone
  - Add a test block: fill `#add-task-form` title input with "Test Ghost", select haunting level "medium" radio, click submit. Wait for `page.waitForSelector('.tombstone-card')`. Assert the card's `h2` contains "Test Ghost". Assert the stats bar alive count text includes "1" (or the incremented value). Log "smoke: add task — PASS".
  - Implements Requirement 1, Requirement 2 (add task renders as tombstone, stats update), acceptance criteria 1–3.

- [ ] 24. Expand `smoke-test.mjs` — bury task moves it and updates stats
  - Add a test block: click `button[aria-label^="Bury: Test Ghost"]`. Wait for `#epitaph-dialog` to be visible. Click the "Skip" button inside the dialog. Wait 500 ms for the bury animation. Assert `.tombstone-card[data-id]` with "Test Ghost" is NOT present in `#graveyard-active`. Assert a card containing "Test Ghost" IS present in `#graveyard-buried`. Assert the stats buried count incremented and alive count decremented. Log "smoke: bury task — PASS".
  - Implements Requirement 3, Requirement 4 (burial, graveyard, stats bar update), acceptance criteria 1–5.

- [ ] 25. Expand `smoke-test.mjs` — filter controls
  - Add a test block: click the "Buried" filter button. Assert `#graveyard-active` contains no `.tombstone-card` elements (or is hidden). Click "Alive". Assert `#graveyard-buried` contains no `.tombstone-card` elements. Click "All". Assert both sections are present in the DOM. Assert `button[aria-pressed="true"]` matches the last-clicked filter. Log "smoke: filters — PASS".
  - Implements Requirement 5 (All/Alive/Buried filters), acceptance criteria 1–3.

- [ ] 26. Expand `smoke-test.mjs` — risen (overdue) styling assertion
  - Add a test block: use `page.evaluate(...)` to inject a task directly into `localStorage` under the key `'tombstone-tasks'` as the object `{ tasks: [{ id: 'risen-test', title: 'Risen Test', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0,10), buried: false, epitaph: null, buriedAt: null, hauntingLevel: 'low', createdAt: new Date().toISOString() }] }` serialized with `JSON.stringify`. Reload the page with `page.reload()`. Wait for `page.waitForSelector('.is-risen')`. Assert the risen card has `class` containing `is-risen`. Assert a `[aria-hidden="true"]` warning icon is present inside the card. Log "smoke: risen styling — PASS".
  - Implements Requirement 7, Requirement 10 (risen overdue styling verified end-to-end), acceptance criteria 1–3.

- [ ] 27. Run `smoke-test.mjs` headless and fix all failures
  - Install Playwright if needed: `npm init -y && npm install playwright`. Run `node smoke-test.mjs`. For each assertion failure, trace it to the responsible task (5–21) and fix the bug in `app.js`, `style.css`, or `index.html`. Re-run after each fix. The workflow is complete when all six smoke-test blocks pass and the script exits with code 0.
  - Implements Requirement 10 (all requirements verified end-to-end by passing smoke test), acceptance criteria covering the full requirement set.
