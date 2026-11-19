# Requirements Document

## Introduction

Tombstone Tasks is a spooky to-do list web app built for the Kiroween 2026 hackathon Costume Contest category. Every task is rendered as a tombstone in a graveyard scene. Users add tasks with a title, optional due date, and haunting level (priority). Completing a task "buries" it with an animation and an epitaph. Overdue tasks "rise from the dead" with zombie styling. All data persists in localStorage. The application is a static HTML/CSS/JS file trio with zero network dependencies, operable from `file://` or any static host.

## Glossary

- **App**: The Tombstone Tasks single-page web application, delivered as `index.html`, `style.css`, and `app.js`.
- **Task**: A user-created to-do item with a title, optional due date, haunting level, status (alive or buried), and optional epitaph.
- **Tombstone_Card**: The visual DOM element representing a Task; always rendered in tombstone shape.
- **Haunting_Level**: The priority of a Task; one of `low`, `medium`, or `high`.
- **Burial**: The act of marking a Task as completed, triggering an animation and epitaph prompt.
- **Epitaph**: A short text line (user-supplied or auto-generated) displayed on a buried Tombstone_Card.
- **Graveyard_Section**: The UI region containing buried Tasks, rendered below the active task list.
- **Active_Section**: The UI region containing alive (not buried) Tasks.
- **Stats_Bar**: A persistent UI strip showing buried count, survival streak, and alive count.
- **Survival_Streak**: The count of consecutive calendar days on which at least one Task was buried.
- **Risen_Task**: A Task whose due date has passed and that has not been buried; displayed with zombie styling.
- **Filter**: A UI control (All / Alive / Buried) that narrows which Tombstone_Cards are visible.
- **Store**: The single in-memory JavaScript object that holds all app state; serialized to and read from `localStorage`.
- **Smoke_Test**: The Playwright headless test file `smoke-test.mjs` at the repo root.
- **Palette_Token**: A CSS custom property prefixed `--tt-` defining a color or surface value.

---

## Requirements

### Requirement 1: Task Creation

**User Story:** As a user, I want to add a task with a title, an optional due date, and a haunting level, so that I can track what I need to do.

#### Acceptance Criteria

1. WHEN the user submits the add-task form with a non-empty title, THE App SHALL create a new Task with that title, store it in the Store, and persist the Store to `localStorage`.
2. WHEN the user submits the add-task form without a title, THE App SHALL prevent submission and display an inline validation message indicating the title is required.
3. WHEN the user submits the add-task form with a due date value, THE App SHALL record that date on the Task.
4. WHEN the user submits the add-task form without a due date value, THE App SHALL create the Task with no due date set.
5. WHEN the user submits the add-task form, THE App SHALL record the selected haunting level (`low`, `medium`, or `high`) on the Task.
6. WHEN the add-task form is rendered, THE App SHALL default the haunting level selection to `low`.
7. WHEN a new Task is created, THE App SHALL assign it a unique identifier that remains stable for the lifetime of the Task.

---

### Requirement 2: Tombstone Card Rendering

**User Story:** As a user, I want each task to appear as a tombstone card in a graveyard scene, so that the app conveys its spooky theme visually.

#### Acceptance Criteria

1. WHEN a Task exists in the Store, THE App SHALL render a Tombstone_Card for it inside the appropriate section (Active_Section or Graveyard_Section).
2. THE App SHALL render the page with a near-black background using `--tt-bg` (`#0d0d0f`), a moon glyph in the header, a fog-layer visual element, and bat decorations in the page header.
3. THE App SHALL render bat decorations in the page header whose visible count equals the number of alive Tasks, capped at five.
4. WHEN a Tombstone_Card is rendered, THE App SHALL display the Task title on the card.
5. WHEN a Task has a due date, THE App SHALL display that date on its Tombstone_Card.
6. WHEN a Task has no due date, THE App SHALL omit the due-date field from its Tombstone_Card.
7. WHEN a Tombstone_Card is rendered, THE App SHALL apply a visual indicator communicating the Task's haunting level using the defined CSS class convention (`.haunting-low`, `.haunting-medium`, or `.haunting-high`).
8. THE App SHALL apply all Palette_Tokens as CSS custom properties on the `:root` element using the specified `--tt-*` names and values.

---

### Requirement 3: Task Burial (Completion)

**User Story:** As a user, I want to mark a task as done so that it gets buried with a satisfying animation and an epitaph, moving it to the Graveyard section.

#### Acceptance Criteria

1. WHEN the user activates the complete action on an alive Tombstone_Card, THE App SHALL open a dialog prompting the user to enter an epitaph line or accept an auto-generated one.
2. WHEN the user confirms burial in the epitaph dialog, THE App SHALL mark the Task as buried, record the epitaph, record the burial timestamp, and persist the Store to `localStorage`.
3. WHEN the user confirms burial and motion is not reduced, THE App SHALL play the bury animation (`transform: translateY(20px)` and `opacity: 0` over 400 ms) on the Tombstone_Card before moving it to the Graveyard_Section.
4. WHEN the user confirms burial and `prefers-reduced-motion` is active, THE App SHALL move the Tombstone_Card to the Graveyard_Section without playing the animation.
5. WHEN the user dismisses the epitaph dialog without confirming, THE App SHALL leave the Task in the alive state with no changes.
6. WHEN a Task is buried with no epitaph text entered by the user, THE App SHALL assign an auto-generated epitaph line.
7. WHEN a Task is buried, THE App SHALL render its Tombstone_Card in the Graveyard_Section at reduced opacity and with a slight downward CSS translate to look sunken.
8. WHEN a Task is buried, THE App SHALL display the Epitaph on its Tombstone_Card in monospace italic style using the monospace font stack.
9. WHEN a Task is buried, THE App SHALL update the Stats_Bar to reflect the new buried count and recalculate the Survival_Streak.

---

### Requirement 4: Stats Bar

**User Story:** As a user, I want to always see how many tasks I have buried, my current streak, and how many tasks are still alive, so that I can track my progress at a glance.

#### Acceptance Criteria

1. THE App SHALL render the Stats_Bar in a position that remains visible at all times regardless of scroll position.
2. THE App SHALL display the total count of buried Tasks in the Stats_Bar.
3. THE App SHALL display the count of alive Tasks in the Stats_Bar.
4. THE App SHALL display the current Survival_Streak value in the Stats_Bar, labelled in survival days.
5. WHEN the Survival_Streak value is greater than zero, THE App SHALL display the moon glyph beside the streak counter with brightness scaled proportionally to the streak length.
6. WHEN any Task state changes, THE App SHALL update all three Stats_Bar values to reflect the current Store contents.
7. THE Survival_Streak SHALL equal the number of consecutive calendar days ending today on which at least one Task was buried, resetting to zero if no Task was buried on the previous calendar day.

---

### Requirement 5: Filters

**User Story:** As a user, I want to filter tasks by All, Alive, or Buried, so that I can focus on a specific subset of tasks.

#### Acceptance Criteria

1. THE App SHALL render a filter control with exactly three options: All, Alive, and Buried.
2. WHEN the user selects the All filter, THE App SHALL display Tombstone_Cards for every Task in the Store.
3. WHEN the user selects the Alive filter, THE App SHALL display only Tombstone_Cards for Tasks that are not buried.
4. WHEN the user selects the Buried filter, THE App SHALL display only Tombstone_Cards for Tasks that are buried.
5. WHEN the app is first loaded, THE App SHALL default the active filter to All.
6. WHEN a filter is active and a Task's state changes in a way that removes it from the current filter's set, THE App SHALL hide that Tombstone_Card without a full re-render of unaffected cards.

---

### Requirement 6: Edit and Delete

**User Story:** As a user, I want to edit or delete a task, so that I can correct mistakes or remove tasks I no longer need.

#### Acceptance Criteria

1. WHEN the user activates the edit action on a Tombstone_Card, THE App SHALL open a dialog pre-populated with the Task's current title, due date, and haunting level.
2. WHEN the user submits the edit dialog with a non-empty title, THE App SHALL update the Task in the Store with the new values and persist the Store to `localStorage`.
3. WHEN the user submits the edit dialog with an empty title, THE App SHALL prevent submission and display an inline validation message indicating the title is required.
4. WHEN the user dismisses the edit dialog without submitting, THE App SHALL leave the Task unchanged.
5. WHEN the user activates the delete action on a Tombstone_Card, THE App SHALL open a confirmation prompt asking the user to confirm deletion.
6. WHEN the user confirms deletion in the confirmation prompt, THE App SHALL remove the Task from the Store, persist the Store to `localStorage`, and remove the Tombstone_Card from the DOM.
7. WHEN the user dismisses the confirmation prompt without confirming, THE App SHALL leave the Task unchanged.
8. WHEN any edit or delete dialog is opened, THE App SHALL place `autofocus` on the first interactive element inside the `<dialog>` element.

---

### Requirement 7: Overdue (Risen) Tasks

**User Story:** As a user, I want overdue tasks to look visually alarming and distinct, so that I immediately know which tasks need urgent attention.

#### Acceptance Criteria

1. WHEN the App evaluates a Task whose due date is earlier than the current calendar date and whose status is alive, THE App SHALL classify that Task as a Risen_Task.
2. WHEN a Tombstone_Card represents a Risen_Task, THE App SHALL apply desaturated (zombie) styling to the card surface.
3. WHEN a Tombstone_Card represents a Risen_Task, THE App SHALL display a fog effect (`--tt-fog` overlay) on the card using a CSS `::before` overlay.
4. WHEN a Tombstone_Card represents a Risen_Task and motion is not reduced, THE App SHALL apply the rise animation (vertical float of 3 px up and down, 3 s `ease-in-out` infinite) to the fog overlay.
5. WHEN a Tombstone_Card represents a Risen_Task, THE App SHALL apply a CSS crack pattern (via `box-shadow` or `border` styling) to the card to convey a cracked tombstone appearance.
6. WHEN a Tombstone_Card represents a Risen_Task, THE App SHALL display a visible warning label on the card using `--tt-blood-bright` text color.
7. WHEN a Tombstone_Card represents a Risen_Task, THE App SHALL display a warning icon with `aria-hidden="true"` and a visually hidden sibling `<span class="sr-only">` containing the word "Overdue".
8. WHEN the App loads or the current time advances past midnight, THE App SHALL re-evaluate all alive Tasks to identify any newly risen ones and update their Tombstone_Cards accordingly.

---

### Requirement 8: Offline-First Persistence

**User Story:** As a user, I want my tasks to be saved automatically and available without an internet connection, so that I never lose my data.

#### Acceptance Criteria

1. THE App SHALL serialize the full Store to `localStorage` under a single key after every state-mutating operation (create, edit, complete, delete).
2. WHEN the App loads, THE App SHALL read the Store from `localStorage` and restore all Tasks before rendering any Tombstone_Cards.
3. WHEN `localStorage` contains no stored data on load, THE App SHALL initialize the Store as empty with no Tasks.
4. THE App SHALL make zero network requests at any point; no `fetch()`, `XMLHttpRequest`, or `WebSocket` calls to any remote host shall be present in the codebase.
5. THE App SHALL load and operate correctly when served from a `file://` URL with no server.
6. THE App SHALL load and operate correctly when served from GitHub Pages or any other static host with no server-side logic.
7. THE App SHALL reference no external resources: no CDN links, no external font files, and no third-party script URLs in any file.

---

### Requirement 9: Responsive Layout and Accessibility

**User Story:** As a user, I want the app to work on any screen size and be fully keyboard accessible, so that I can use it on any device without a mouse.

#### Acceptance Criteria

1. THE App SHALL adapt its layout so that all content is readable and usable on viewport widths from 320 px to 1920 px without horizontal scrolling.
2. THE App SHALL make every interactive element (buttons, form fields, filter controls, dialog triggers) reachable by pressing Tab and activatable by pressing Enter or Space.
3. THE App SHALL apply a visible focus ring of `outline: 2px solid var(--tt-green-glow)` with `outline-offset: 2px` to every focused interactive element.
4. THE App SHALL provide an `aria-label` attribute on every icon-only button.
5. THE App SHALL use a `<dialog>` element for every modal interaction (add task, edit task, epitaph prompt, delete confirmation).
6. WHEN a `<dialog>` is opened, THE App SHALL place `autofocus` on the first interactive child element within the dialog.
7. THE App SHALL ensure text rendered on `--tt-bg` meets WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
8. THE App SHALL ensure `--tt-blood-bright` text is used only in contexts where the contrast ratio against the adjacent surface color passes WCAG AA.
9. THE App SHALL render all spooky icons (bats, moon, skull) with `aria-hidden="true"` and, where the icon carries meaning, include a sibling `<span class="sr-only">` with an equivalent text description.
10. THE App SHALL render every user-visible string in English.
11. THE App SHALL use only the system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) for body text and the monospace system stack (`ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace`) for epitaphs; no external font files shall be referenced.

---

### Requirement 10: Smoke Test

**User Story:** As a developer, I want a Playwright headless smoke test, so that I can verify the critical user flows work correctly after each change.

#### Acceptance Criteria

1. THE Smoke_Test SHALL be a single file named `smoke-test.mjs` located at the repository root.
2. WHEN the Smoke_Test runs, THE Smoke_Test SHALL launch a headless browser, load the App, and assert that the page title or a known landmark element is present, confirming the App loaded without errors.
3. WHEN the Smoke_Test adds a task with a title, THE Smoke_Test SHALL assert that a Tombstone_Card bearing that title appears in the Active_Section.
4. WHEN the Smoke_Test completes the added task, THE Smoke_Test SHALL assert that the Tombstone_Card moves to the Graveyard_Section and that the buried count in the Stats_Bar increments by one.
5. WHEN the Smoke_Test selects the Alive filter, THE Smoke_Test SHALL assert that buried Tombstone_Cards are not visible.
6. WHEN the Smoke_Test selects the Buried filter, THE Smoke_Test SHALL assert that only buried Tombstone_Cards are visible.
7. WHEN the Smoke_Test selects the All filter, THE Smoke_Test SHALL assert that all Tombstone_Cards are visible.
8. WHEN the Smoke_Test creates a task with a past due date, THE Smoke_Test SHALL assert that the resulting Tombstone_Card carries the risen styling indicators (warning label and fog/crack class).
