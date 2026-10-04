# Contracts: Brew Timer Experience

This feature is implemented within a single frontend application and does not expose a backend API contract. The relevant interface contract is the user-facing timer workflow in the React UI:

- Home screen route and actions for focus/custom timers
- Timer control actions: start, pause, reset, cancel, and complete
- Completion feedback events and next-step choices
- Theme and audio preference toggles

No external API schema is required for this v1 feature because the app remains client-driven and uses browser-local state for primary flow control.
