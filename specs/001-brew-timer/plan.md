# Implementation Plan: Brew Timer Experience

**Branch**: `001-brew-timer` | **Date**: 2026-10-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-brew-timer/spec.md`

## Summary

Deliver a polished browser-based timer experience for Brewly that supports quick focus sessions and custom brew durations, clear completion feedback, and resilient offline behavior without introducing unnecessary complexity. The implementation will stay within the existing React + Vite single-page app pattern and rely on local state, keyboard-friendly and screen-reader-friendly UI patterns, and careful validation rather than introducing new infrastructure. A shared `src/utils/timerState.js` abstraction will standardize timer lifecycle transitions across the focus and custom brew flows.

## Technical Context

**Language/Version**: JavaScript (ES2022) on React 18.2.0 with Vite 5.2.0

**Primary Dependencies**: React, @react-three/fiber, @react-three/drei, three, Firebase

**Storage**: Browser-local state for active timer sessions; optional Firebase-backed user stats for profile history; no dedicated server-side data store required for v1

**Testing**: `npm run lint`, `npm run build`, and manual scenario validation in the browser

**Target Platform**: Modern desktop and mobile browsers with progressive web app capabilities

**Project Type**: Frontend web app / PWA

**Performance Goals**: Timer updates remain precise to one-second intervals with no perceptible UI lag during active sessions; app remains responsive while theme/audio toggles occur

**Constraints**: Must remain offline-resilient for core timer flows, accessible for keyboard/assistive users, and deterministic for state transitions; the app must continue to provide a clear, understandable timer state when connectivity is weak or temporarily unavailable

**Scale/Scope**: Single-page app with a few core screens and timer modes; no backend service or multi-tenant system required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This plan passes the Brewly constitution because it:

- Keeps the user experience centered on quick, understandable timing actions.
- Preserves reliable, offline-first timer behavior without relying on network connectivity.
- Uses accessible interfaces and readable state cues for all interactive flows, including keyboard and screen-reader support.
- Requires verification through build, lint, and manual validation before acceptance.
- Stays simple and maintainable by extending the current single-app architecture instead of adding new infrastructure.

## Project Structure

### Documentation (this feature)

```text
specs/001-brew-timer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (UI contract notes, if needed)
└── tasks.md             # Phase 2 output (not created here)
```

### Source Code (repository root)

```text
src/
├── App.jsx
├── main.jsx
├── firebase.js
├── index.css
├── utils/
│   └── timerState.js
├── components/
│   ├── Auth.jsx
│   ├── Background3D.jsx
│   ├── BrewingAnimation.jsx
│   ├── CoffeeCup3D.jsx
│   ├── CustomTimer.jsx
│   ├── Home.jsx
│   ├── Mascot.jsx
│   └── PomodoroTimer.jsx
└── assets/
```

**Structure Decision**: Use the existing single frontend application structure. Timer logic and UI remain in the `src/components` layer, while app-level composition stays in `src/App.jsx`, Firebase integration remains isolated in `src/firebase.js`, and shared timer lifecycle behavior is centralized in `src/utils/timerState.js` for consistency across focus and custom brew flows.

## Complexity Tracking

No constitution violations or cross-project expansion were identified for this feature. No additional complexity exceptions are required.

