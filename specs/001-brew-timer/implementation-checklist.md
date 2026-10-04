# Brew Timer Implementation Checklist

## Shared timer behavior

- [x] Use one timer-state model for focus and custom sessions.
- [x] Support start, pause, resume, reset, cancel, and completion transitions.
- [x] Derive remaining time from a deadline so delayed browser callbacks do not accumulate timing drift.
- [x] Restore the active timer after a reload without restarting its duration.

## User flows

- [x] Keep the focus and custom timer entry points available from Home.
- [x] Show clear completion feedback and next-step actions for both timer modes.
- [x] Keep completion audio optional and handle browser playback restrictions.
- [x] Keep timer state and status understandable when connectivity changes.

## Accessibility

- [x] Support keyboard activation and navigation for all timer actions.
- [x] Show a visible focus indicator in day and night themes.
- [x] Provide descriptive accessible names and concise screen-reader status announcements.

## Validation

- [x] Test timer transitions and deadline-based recovery with deterministic unit tests.
- [x] Resolve the project-wide lint errors and rerun lint.
- [x] Build the production app.
- [x] Verify focus, custom, reload recovery, offline, and keyboard behavior in a browser.
- [ ] Conduct participant testing and record evidence for the SC-002 90% first-attempt success threshold and SC-005 95% timer-state clarity threshold; technical/browser checks are not participant-study results.
