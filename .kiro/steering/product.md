# Product Steering — Tombstone Tasks

## What it is

Tombstone Tasks is a spooky to-do list web app where every task is a tombstone in a graveyard scene. Built as a Kiroween 2026 hackathon entry in the Costume Contest category.

## Audience

Hackathon judges evaluating creative execution, and casual users who want a memorable task tracker.

## Core loop

1. **Add a task** — provide a title, an optional due date, and a haunting level (low / medium / high, the app's name for priority).
2. **Tombstone appears** — the task renders as a tombstone card in the graveyard.
3. **Complete a task** — the user marks it done; the app prompts for or auto-generates a short epitaph line, then buries the tombstone with an animation.
4. **Graveyard section** — buried tasks move to a separate Graveyard section below the active list.
5. **Stats bar** — always visible, showing: buried count, current streak in survival days (consecutive days with at least one task completed), and alive (active) task count.
6. **Filters** — All / Alive / Buried toggle to narrow the view.
7. **Edit** — open any task to change title, due date, or haunting level.
8. **Delete** — remove a task entirely (with a confirmation prompt).

## Overdue behavior

Tasks whose due date has passed and are not yet buried are **risen from the dead**: they receive zombie styling (desaturated, cracked tombstone look, warning icon) and a visible warning label.

## Tone

Spooky, playful, and respectful. No gore, no jump-scares, no offensive humor. Epitaph lines should be wry and lighthearted ("They finally replied to that email").
