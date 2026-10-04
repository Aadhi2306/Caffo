# Research: Brew Timer Experience

## Decision

Use a client-side timer model built from React state and a single `useEffect`-driven countdown loop for each active session. Keep timer state local to the current view and reuse the same pattern for work and custom brew modes.

## Rationale

- The existing app already uses component-local state for timer flows in `PomodoroTimer.jsx` and `CustomTimer.jsx`.
- Client-side timing keeps the feature responsive, simple, and resilient when the network is unreliable.
- The product goal is a fast, understandable session flow rather than a distributed or server-backed workflow.
- Deterministic state transitions reduce risk for accessibility and user expectations.

## Alternatives Considered

1. Centralized global timer store
   - Rejected because the app is a small single-page interface and a shared store would add indirection without meaningful benefit.

2. Server-backed session management
   - Rejected because the feature does not require multi-device synchronization, and offline behavior is a core requirement.

3. Complex reducer/state-machine framework
   - Rejected because the current scope is modest and the simpler state pattern is easier to audit and maintain.

## Research Notes

- Audio completion cues should be optional and non-blocking because browsers may suppress autoplay.
- Service-worker and cached assets are useful for offline resilience, but the core timer flow must not depend on network connectivity.
- Accessibility should be handled through semantic buttons, visible labeling, and readable timer feedback rather than custom interaction patterns that hide state.
