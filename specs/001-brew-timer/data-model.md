# Data Model: Brew Timer Experience

## Entities

### BrewSession

Represents a single timed activity.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| id | string | Stable identifier for the current session instance | Required when a session is created |
| mode | enum | `work`, `shortBreak`, `longBreak`, or `custom` | Must be one of the supported modes |
| durationSeconds | number | Planned total duration in seconds | Must be greater than 0 |
| remainingSeconds | number | Current countdown value | Must be between 0 and durationSeconds |
| state | enum | `idle`, `running`, `paused`, `completed` | Must be valid for the current lifecycle |
| startedAt | timestamp | Optional start moment | Required if state is `running` |

### UserPreference

Represents user-facing experience settings.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| theme | enum | `day` or `night` | Restricted to supported values |
| audioEnabled | boolean | Whether ambient or completion audio is allowed | Must be boolean |
| installPromptVisible | boolean | Whether the install affordance is displayed | Must be boolean |

### CompletionEvent

Represents the app-level notification at the end of a session.

| Field | Type | Description | Validation |
| --- | --- | --- | --- |
| sessionId | string | Linked session identifier | Must match an existing session |
| completedAt | timestamp | When the timer reached zero | Required |
| nextAction | enum | `shortBreak`, `longBreak`, `repeat`, `home` | Must be a valid next-step choice |

## State Transitions

- `idle` -> `running` when a user starts a session
- `running` -> `paused` when the user pauses or cancels mid-session
- `running` -> `completed` when remaining seconds reaches zero
- `paused` -> `running` when the user resumes
- `completed` -> `idle` after reset or a new session begins

## Validation Rules

- A timer must never have a negative remaining duration.
- Completion triggers must be visible and user-actionable.
- Audio output is optional and must degrade gracefully when browser restrictions block playback.
- Session state must remain coherent even if the page reloads or connectivity changes.

## Persistence Notes

This feature does not require a server-side persistence layer for the primary workflow. Browser state and optional Firebase analytics can be used to record summary statistics without changing the core user flow.
