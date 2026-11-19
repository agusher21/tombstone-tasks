# Structure Steering — Tombstone Tasks

## Repo layout

```
tombstone-tasks/
├── index.html          # app entry point
├── style.css           # all styles
├── app.js              # all behavior
├── README.md           # project overview (already present)
├── LICENSE             # license file (already present)
├── smoke-test.mjs      # Playwright headless smoke test (added during implementation)
└── .kiro/
    ├── steering/
    │   ├── product.md
    │   ├── tech.md
    │   ├── structure.md
    │   └── costume-contest.md
    ├── hooks/
    │   ├── smoke-test-on-save.json
    │   └── guard-no-network.json
    └── agents/
        └── graveyard-builder.json
```

No subdirectories for application source. No `src/`, `dist/`, `public/`, or `assets/` directories.

## Naming conventions

- **Files**: kebab-case (`smoke-test.mjs`, `style.css`).
- **HTML**: semantic elements (`<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<dialog>`); `id` and `class` attributes in kebab-case.
- **CSS**: custom properties for every palette color and spacing token, prefixed `--tt-` (e.g. `--tt-bg`, `--tt-bone`, `--tt-green`); class names in kebab-case (`.tombstone-card`, `.haunting-high`).
- **JavaScript**: camelCase identifiers; one `store` object as the single source of truth for app state; small, focused functions (one responsibility each); no other global mutable state.

## Localization

Every user-visible string is in English. No i18n layer needed for this release.

## Accessibility baseline

- Keyboard navigable: all interactive elements reachable by Tab, activated by Enter or Space.
- Sufficient color contrast (WCAG AA minimum) even on the dark background.
- `aria-label` on icon-only buttons.
- `<dialog>` used for modals with `autofocus` on the first interactive child.
