# Tombstone Tasks

A spooky to-do list built for the Kiroween 2026 hackathon (Costume Contest). Every task is a
tombstone in a graveyard: plant a task, watch it stand among the dead, and bury it with an epitaph
when it is done. Overdue tasks rise from the dead with fog, cracks, and a warning. Streaks are
tracked in survival days, and the moon in the header brightens as your streak grows.

## Run it

No build step, no dependencies, no server required. Open `index.html` directly in a browser (it
works from `file://`), or serve the folder with any static server:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Tasks persist in `localStorage` under the key `tombstone-tasks`.
The app makes zero network requests.

## Smoke test

```sh
npm install
node smoke-test.mjs
```

The Playwright smoke test loads the app headless, adds a task, buries it, checks the filters and
the risen styling, and exits 0 when every assertion passes.

## How it was built with Kiro

Tombstone Tasks was built with Kiro (CLI 3.5.0) using spec-driven development. The evidence is in
`.kiro/`:

- `.kiro/specs/tombstone-tasks/` — the feature spec: `requirements.md` (EARS requirements),
  `design.md` (architecture, data model, styling), `tasks.md` (27 implementation tasks in 4
  dependency waves).
- `.kiro/steering/` — persistent project knowledge loaded into every session (product, tech,
  structure, Costume Contest rules).
- `.kiro/hooks/` — the smoke-test-on-save hook runs the Playwright smoke test after every save to
  an HTML, CSS, or JS file.
- `.kiro/agents/` — the graveyard-builder custom agent (scoped tools, permissions, pinned steering)
  used for the build.

The app code was authored inside Kiro sessions executing the spec tasks wave by wave, with the
smoke test verifying each wave.

## License

MIT — see LICENSE.
