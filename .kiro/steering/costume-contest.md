---
inclusion: always
---

# Costume Contest Steering — Tombstone Tasks

## Palette

| Token | Value | Use |
|-------|-------|-----|
| `--tt-bg` | `#0d0d0f` | Page background (near-black) |
| `--tt-surface` | `#1a1a1f` | Card and panel surfaces |
| `--tt-bone` | `#e8e4d9` | Primary text (bone white) |
| `--tt-bone-dim` | `#a09a8e` | Secondary / muted text |
| `--tt-green` | `#4a7c59` | Grave green accents, borders, active indicators |
| `--tt-green-glow` | `#6db88a` | Hover states, focus rings |
| `--tt-blood` | `#8b1a1a` | Danger actions, overdue warning backgrounds |
| `--tt-blood-bright` | `#c0392b` | Overdue text and icons |
| `--tt-moon` | `#f5e6a3` | Moon glyph, streak counter highlight |
| `--tt-fog` | `rgba(180,200,180,0.08)` | Fog overlay on overdue tombstones |

## Spooky UI rules

Every decorative spooky element must carry a function:

- **Tombstone cards** — the visual form of every task. Shape (rounded top arch) and texture communicate state.
- **Moon glyph** — displayed beside the streak counter; brightness scales with the streak length.
- **Fog effect** — a low CSS `backdrop-filter` blur or `::before` overlay marks overdue (risen) tasks; fog = danger without color alone.
- **Bat decorations** — small SVG or CSS-drawn bats appear in the page header; count matches alive task count (capped at 5) so they carry information.
- **Crack texture on tombstones** — overdue tasks get a CSS crack pattern (box-shadow or border style) in addition to the fog.
- **Buried tombstones** — rendered at reduced opacity and slight downward translate to look sunken.
- **Epitaph line** — displayed in a monospace italic style on buried cards; the final piece of task information.

## Interaction motion

Use `prefers-reduced-motion` to gate all animations. When motion is allowed:

- Bury animation: tombstone slides down and fades (`transform: translateY(20px); opacity: 0`) over 400 ms.
- Rise animation (overdue): subtle vertical float loop (3 px up/down, 3 s ease-in-out infinite) on the fog overlay.
- No hard cuts on state changes — use short opacity/transform transitions (150–300 ms).

## Keyboard and contrast

- Focus rings must be visible: `outline: 2px solid var(--tt-green-glow)` with `outline-offset: 2px`.
- Text on `--tt-bg` must meet WCAG AA (4.5 : 1 for normal text, 3 : 1 for large text).
- Blood-red text (`--tt-blood-bright`) used only where the contrast ratio against the surface color passes AA.
- All spooky icons (bats, moon, skull) must have `aria-hidden="true"` with a sibling `<span class="sr-only">` for screen readers where the icon carries meaning.

## What is forbidden

- Jump-scares (sudden full-screen overlays, flashing, loud audio).
- Gore imagery.
- Offensive or mocking epitaphs in default/sample content.
- Any decorative element that has no functional meaning in the UI.
