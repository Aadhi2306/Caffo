# Tasks: Brew Timer Experience

**Input**: Design documents from `/specs/001-brew-timer/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing app structure and validation path before story work begins.

- [x] T001 Create a quick implementation checklist aligned with the plan and spec in `specs/001-brew-timer/plan.md` and `specs/001-brew-timer/spec.md`
- [ ] T002 [P] Confirm the current validation workflow in `package.json` and verify the app can run lint and build checks with `npm run lint` and `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the state and UI patterns that all timer stories reuse without adding new infrastructure.

**⚠️ CRITICAL**: User story implementation should not start until this phase is complete.

- [x] T003 [P] [US1] Create the shared timer-state helper in `src/utils/timerState.js` to standardize mode, duration, remaining time, and lifecycle transitions for focus and custom sessions
- [x] T004 [P] [US1] Review and normalize the timer controls in `src/components/PomodoroTimer.jsx` and `src/components/CustomTimer.jsx` so they share a consistent start/pause/reset/cancel flow
- [x] T005 [US1] Add keyboard and assistive-technology semantics in `src/components/PomodoroTimer.jsx`, `src/components/CustomTimer.jsx`, and `src/components/Home.jsx`, including visible focus states, clear labels, and accessible timer actions for keyboard-only and screen-reader users

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Start a rapid brewing or focus session (Priority: P1) 🎯 MVP

**Goal**: Deliver the core experience where a user can start a preset or custom session and immediately see a live countdown.

**Independent Test**: Open the app, start a timer, and verify the session begins promptly and displays the countdown clearly.

### Implementation for User Story 1

- [x] T006 [P] [US1] Update `src/components/Home.jsx` to present the primary controls and navigation clearly for focus and custom brewing entry points
- [x] T007 [P] [US1] Update `src/components/PomodoroTimer.jsx` so the focus session starts from a valid duration, updates the remaining time accurately, and preserves the active mode visually
- [x] T008 [US1] Update `src/components/CustomTimer.jsx` so the custom session selection and countdown behavior match the same lifecycle and clarity as the preset timer
- [x] T009 [US1] Ensure the timer loops and state transitions remain deterministic in `src/components/PomodoroTimer.jsx` and `src/components/CustomTimer.jsx` without hidden timing drift

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Complete a session and recover cleanly (Priority: P2)

**Goal**: Deliver clear completion feedback and graceful recovery when a session ends or the app state changes.

**Independent Test**: Run a timer to zero, confirm the completion prompt displays, and reload or reconnect to validate the app remains understandable and functional.

### Implementation for User Story 2

- [x] T010 [P] [US2] Update `src/components/PomodoroTimer.jsx` to show a clear completion state and next-step choices after a work session ends
- [x] T011 [P] [US2] Update `src/components/CustomTimer.jsx` to trigger completion feedback and allow the user to start another brew cleanly after the timer reaches zero
- [x] T012 [US2] Add resilient notification handling in `src/components/PomodoroTimer.jsx` and `src/components/CustomTimer.jsx` so audio cues are optional and degrade gracefully when browsers block autoplay
- [x] T013 [US2] Implement low-connectivity recovery behavior in `src/App.jsx` and the timer components so that if the network drops or is weak, the core timer remains understandable, recoverable, and usable without a stable connection
- [x] T014 [US2] Validate the offline-recovery browser behavior in `src/App.jsx` and the timer components: the app must keep the active timer state clear, avoid blocking the user, and allow a sensible resume or reset path when connectivity is restored or absent

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Personalize the atmosphere without losing clarity or accessibility (Priority: P3)

**Goal**: Add experience settings that improve comfort without undermining or obscuring the core timer workflow or accessible interactions.

**Independent Test**: Toggle the theme or ambient audio while a timer is active and confirm the app remains clear, responsive, usable, and navigable with keyboard and screen-reader cues.

### Implementation for User Story 3

- [x] T015 [P] [US3] Update `src/App.jsx` so theme and audio toggles remain stable while the timer session state is preserved
- [x] T016 [P] [US3] Adjust `src/components/Home.jsx` and app-level controls to keep the timer entry points and preference toggles understandable and visually consistent
- [x] T017 [US3] Review installability and PWA affordances in `src/App.jsx` so the app installation path remains available without interrupting the timer experience
- [x] T018 [US3] Confirm the full UI remains readable and accessible in both day and night mode across `src/components/Home.jsx`, `src/components/PomodoroTimer.jsx`, and `src/components/CustomTimer.jsx`, including visible focus states and screen-reader-friendly labels for timer actions

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility review, and consistency pass across the full feature.

- [ ] T019 [P] Run the project validation workflow from `quickstart.md` with `npm run lint` and `npm run build`
- [x] T020 Review all timer flows for accessibility, readability, and state clarity in `src/App.jsx`, `src/components/Home.jsx`, `src/components/PomodoroTimer.jsx`, and `src/components/CustomTimer.jsx`
- [x] T021 [P] Clean up any redundant timer logic or inconsistent naming across the timer components and keep the implementation aligned with the Brewly constitution
- [ ] T022 Validate the MVP and story-level completion criteria against the spec in `specs/001-brew-timer/spec.md` before marking the feature ready for review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can integrate with User Story 1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and can integrate with earlier stories
- **Polish (Phase 6)**: Depends on all desired stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependencies on other user stories
- **User Story 2 (P2)**: Can start after Foundational and should remain independently testable
- **User Story 3 (P3)**: Can start after Foundational and should remain independently testable

### Parallel Opportunities

- `T002` can run in parallel with `T001`
- `T003`, `T004`, and `T005` can be worked in parallel once the setup phase completes
- `T006`, `T007`, and `T008` can be implemented in parallel within User Story 1
- `T010` and `T011` can be developed together for User Story 2
- `T015` and `T016` can be developed together for User Story 3
- `T019` and `T021` can run in parallel during the final polish phase

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases
2. Complete User Story 1
3. Stop and validate the timer lifecycle independently
4. Expand to User Story 2 and User Story 3 only after the MVP passes

### Incremental Delivery

1. Complete Setup + Foundational → timer architecture baseline ready
2. Add User Story 1 → immediate session start and active countdown
3. Add User Story 2 → completion feedback and recovery behavior
4. Add User Story 3 → personalization while preserving clarity
5. Finish with polish and validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once the foundation is ready:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Final polish happens after all stories are complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story for traceability
- Each user story should be independently completable and testable
- Validate after each logical group rather than at the end only
- Avoid broad cross-story refactors unless they directly support the timer behavior
- Keep the implementation aligned with the Brewly constitution: readable flows, offline-safe timers, and accessible controls

## Phase 7: Convergence

- [x] T023 Restore clear completion feedback and a next action when a Pomodoro break reaches zero while the page is unloaded, per FR-005, FR-006, and US2/AC1–AC2 (partial)
- [x] T024 Align the Home hero control's accessible name with its actual navigation action, per FR-009 and Constitution III (partial)
- [x] T025 CRITICAL: Resolve project-wide ESLint failures, including React Three Fiber JSX property handling, and pass `npm run lint` without changing intended UI behavior, per T002, T019, and Constitution IV (partial)
- [ ] T026 Conduct and record user validation for the 90% first-attempt task success and 95% timer-state clarity thresholds, per SC-002, SC-005, and T022 (partial)

## Phase 8: Convergence

- [ ] T027 Conduct participant testing and record participant count, first-attempt start/pause/reset success rate, and timer-state clarity rate; compare results with the SC-002 90% and SC-005 95% thresholds and do not infer outcomes from automated/browser checks, per T026 and SC-002/SC-005 (missing)
