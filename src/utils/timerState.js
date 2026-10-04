export const TIMER_MODES = {
  work: 'work',
  shortBreak: 'shortBreak',
  longBreak: 'longBreak',
  custom: 'custom',
};

export const TIMER_STORAGE_KEY = 'brewly.timerState';

const TIMER_STATES = new Set(['idle', 'running', 'paused', 'completed']);
const TIMER_MODE_VALUES = new Set(Object.values(TIMER_MODES));

export function normalizeDuration(seconds) {
  if (!Number.isFinite(seconds)) return 0;
  return Math.max(0, Math.floor(seconds));
}

function createSessionId(now) {
  return `${now}-${Math.random().toString(36).slice(2)}`;
}

export function createTimerState(mode, durationSeconds, now = Date.now()) {
  const duration = normalizeDuration(durationSeconds);

  return {
    sessionId: createSessionId(now),
    mode,
    durationSeconds: duration,
    remainingSeconds: duration,
    state: 'idle',
    startedAt: null,
    deadlineAt: null,
    completedAt: null,
  };
}

export function getModeLabel(mode) {
  switch (mode) {
    case TIMER_MODES.shortBreak:
      return 'Short Break';
    case TIMER_MODES.longBreak:
      return 'Long Break';
    case TIMER_MODES.custom:
      return 'Custom Brew';
    case TIMER_MODES.work:
    default:
      return 'Focus Session';
  }
}

export function getProgressRatio(remainingSeconds, totalSeconds) {
  const total = normalizeDuration(totalSeconds);
  const remaining = normalizeDuration(remainingSeconds);

  if (!total) return 0;
  return Math.min(Math.max((total - remaining) / total, 0), 1);
}

export function getCurrentTimerStatus(remainingSeconds, isRunning) {
  if (remainingSeconds <= 0) return 'Complete';
  if (!isRunning) return 'Paused';
  return 'Running';
}

export function formatTime(seconds) {
  const normalized = normalizeDuration(seconds);
  const minutes = Math.floor(normalized / 60).toString().padStart(2, '0');
  const remainder = (normalized % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function tickTimer(timer, now = Date.now()) {
  if (!timer || timer.state !== 'running') return timer;

  const remainingSeconds = normalizeDuration(
    Math.ceil((timer.deadlineAt - now) / 1000),
  );

  if (remainingSeconds === 0) {
    return {
      ...timer,
      remainingSeconds: 0,
      state: 'completed',
      startedAt: null,
      deadlineAt: null,
      completedAt: now,
    };
  }

  return { ...timer, remainingSeconds };
}

export function startTimer(timer, now = Date.now()) {
  if (!timer || timer.durationSeconds <= 0) return timer;

  const current = tickTimer(timer, now);
  if (current.state === 'running' || current.state === 'completed') return current;

  return {
    ...current,
    state: 'running',
    startedAt: now,
    deadlineAt: now + current.remainingSeconds * 1000,
    completedAt: null,
  };
}

export function pauseTimer(timer, now = Date.now()) {
  if (!timer || timer.state !== 'running') return timer;

  const current = tickTimer(timer, now);
  if (current.state !== 'running') return current;

  return {
    ...current,
    state: 'paused',
    startedAt: null,
    deadlineAt: null,
  };
}

export function resetTimer(timer) {
  if (!timer) return timer;

  return {
    ...timer,
    sessionId: createSessionId(Date.now()),
    remainingSeconds: timer.durationSeconds,
    state: 'idle',
    startedAt: null,
    deadlineAt: null,
    completedAt: null,
  };
}

export function cancelTimer(timer, now = Date.now()) {
  if (!timer) return timer;
  return createTimerState(timer.mode, 0, now);
}

function isValidTimerState(timer) {
  return (
    timer !== null &&
    typeof timer === 'object' &&
    typeof timer.sessionId === 'string' &&
    TIMER_MODE_VALUES.has(timer.mode) &&
    TIMER_STATES.has(timer.state) &&
    Number.isFinite(timer.durationSeconds) &&
    timer.durationSeconds >= 0 &&
    Number.isFinite(timer.remainingSeconds) &&
    timer.remainingSeconds >= 0 &&
    timer.remainingSeconds <= timer.durationSeconds &&
    (timer.state !== 'running' || Number.isFinite(timer.deadlineAt))
  );
}

export function restoreTimerState(timer, now = Date.now()) {
  if (!isValidTimerState(timer)) return null;
  return tickTimer(timer, now);
}

export function readTimerState(now = Date.now()) {
  if (typeof window === 'undefined') return null;

  try {
    const serialized = window.localStorage.getItem(TIMER_STORAGE_KEY);
    if (!serialized) return null;

    const restored = restoreTimerState(JSON.parse(serialized), now);
    if (!restored) {
      console.warn('[timerState] Ignoring invalid saved timer state.');
      window.localStorage.removeItem(TIMER_STORAGE_KEY);
    }
    return restored;
  } catch (error) {
    console.error('[timerState] Unable to read saved timer state.', error);
    return null;
  }
}

export function saveTimerState(timer) {
  if (typeof window === 'undefined') return;

  try {
    if (!timer || (timer.state === 'idle' && timer.durationSeconds === 0)) {
      window.localStorage.removeItem(TIMER_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error('[timerState] Unable to save timer state.', error);
  }
}

export function playCompletionSound() {
  try {
    const audio = new Audio('/assets/notification.mp3');
    const playback = audio.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch((error) => {
        console.info('[timerState] Completion audio is unavailable.', error);
      });
    }
  } catch (error) {
    console.info('[timerState] Completion audio is unavailable.', error);
  }
}
