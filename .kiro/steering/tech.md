# Technical Steering — Tombstone Tasks

## Stack

Static HTML, CSS, and JavaScript only. No framework, no build step, no bundler, no backend, no database.

## Network policy — strictly offline

Zero network calls:
- No CDN links (no jsDelivr, unpkg, cdnjs, or similar).
- No external fonts (no Google Fonts, no @font-face pointing off-domain).
- No analytics, telemetry, or tracking pixels.
- No fetch(), no XMLHttpRequest, no WebSocket to any remote host.

The app must run correctly from `file://` and from any static host such as GitHub Pages with no server-side logic.

## Persistence

localStorage only. All task data is serialized to and read from `localStorage`. No IndexedDB, no cookies, no sessionStorage as primary store.

## Typography

Use the system font stack:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Monospace sections (epitaphs, debug) use:

```css
font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
```

No external font files.

## File layout

Three application files at the repo root:

| File | Purpose |
|------|---------|
| `index.html` | Markup, semantic structure, ARIA roles |
| `style.css` | All visual styling via CSS custom properties |
| `app.js` | All behavior, localStorage I/O, DOM manipulation |

A fourth file, `smoke-test.mjs`, will be added during implementation as a Playwright headless test.

## Constraints

- No `import`/`export` ES modules in `app.js` (file:// compatibility); use a single IIFE or top-level script.
- No `eval()`, no `innerHTML` with unsanitized user input.
- Target: last two versions of Chrome, Firefox, and Safari.
