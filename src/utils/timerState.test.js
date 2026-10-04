import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cancelTimer,
  createTimerState,
  formatTime,
  pauseTimer,
  resetTimer,
  restoreTimerState,
  startTimer,
  tickTimer,
} from './timerState.js';

test('formats timer values and clamps invalid durations', () => {
  assert.equal(formatTime(125), '02:05');
  assert.equal(formatTime(-3), '00:00');
  assert.equal(formatTime(Number.NaN), '00:00');
});

test('start, pause, and resume preserve elapsed time without accumulating drift', () => {
  const initial = createTimerState('custom', 10, 0);
  const running = startTimer(initial, 0);
  assert.equal(running.state, 'running');
  assert.equal(running.deadlineAt, 10_000);

  const paused = pauseTimer(running, 3_200);
  assert.equal(paused.state, 'paused');
  assert.equal(paused.remainingSeconds, 7);

  const resumed = startTimer(paused, 20_000);
  assert.equal(resumed.deadlineAt, 27_000);
  assert.equal(tickTimer(resumed, 21_500).remainingSeconds, 6);
});

test('late timer callbacks complete at the deadline and saved running timers recover', () => {
  const running = startTimer(createTimerState('work', 3, 1000), 1000);
  const recovered = restoreTimerState(running, 2500);
  assert.equal(recovered.remainingSeconds, 2);

  const completed = tickTimer(running, 6000);
  assert.equal(completed.state, 'completed');
  assert.equal(completed.remainingSeconds, 0);
  assert.equal(completed.completedAt, 6000);
});

test('reset returns to the selected duration and cancel clears it', () => {
  const running = startTimer(createTimerState('custom', 300, 0), 0);
  const reset = resetTimer(pauseTimer(running, 10_000));
  assert.equal(reset.state, 'idle');
  assert.equal(reset.remainingSeconds, 300);

  const cancelled = cancelTimer(reset, 20_000);
  assert.equal(cancelled.state, 'idle');
  assert.equal(cancelled.durationSeconds, 0);
});

test('invalid persisted timer data is rejected', () => {
  assert.equal(restoreTimerState({ mode: 'unknown' }, 0), null);
});
