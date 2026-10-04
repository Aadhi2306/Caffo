# Quickstart: Validate the Brew Timer Experience

## Prerequisites

- Node.js 18+ or a compatible current LTS version
- npm installed with the repository dependencies

## Setup

```bash
npm install
```

## Validation Commands

```bash
npm run lint
npm run build
node --test src/utils/timerState.test.js
```

## Manual Validation Scenarios

1. Open the app and confirm the home screen exposes both focus and custom brew options.
2. Start a preset focus timer and verify the countdown begins immediately and updates once per second.
3. Pause and reset the timer to confirm the session state is clear and the UI does not leave the user in an ambiguous state.
4. Start a custom brew timer and confirm the selected duration is respected and the completion flow is shown.
5. Trigger the completion state and verify the next-step controls appear without leaving the timer stuck in a broken state.
6. Toggle day/night mode and audio preferences to confirm they do not interrupt the active countdown.
7. Reload the page during a running or paused session and verify the timer restores with the correct remaining time and controls.
8. Disable network access in browser developer tools while a timer is active; confirm the timer continues, an offline status is announced, and reload restores the session.
9. Restore network access and confirm the offline status clears without interrupting the timer.
10. Use Tab, Shift+Tab, Enter, and Space to navigate and activate the home and timer controls; verify focus remains visible in day and night themes.
11. Trigger the focus completion dialog and verify it receives focus, traps keyboard navigation while open, and returns focus to the timer when an action is chosen.

## Participant Outcome Validation

Implementation and browser checks do not establish the participant outcome thresholds. T022 remains open until user testing is conducted and recorded showing whether at least 90% of participants can start, pause, and reset without guidance on their first attempt (SC-002), and whether at least 95% of observed trials distinguish timer state and timing information without ambiguity (SC-005). No participant results have been collected or inferred.

## Expected Outcome

The app should provide a reliable, readable timer experience across the main flows without requiring a network connection for core interactions.
