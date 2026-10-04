import React, { useEffect, useRef, useState } from 'react';
import {
  cancelTimer,
  createTimerState,
  formatTime,
  pauseTimer,
  playCompletionSound,
  readTimerState,
  resetTimer,
  saveTimerState,
  startTimer,
  tickTimer,
  TIMER_MODES,
} from '../utils/timerState';
import './CustomTimer.css';
import BrewingAnimation from './BrewingAnimation';

const TIMES = [5, 10, 15, 20, 25, 30, 45, 60];

function createInitialTimer() {
  const savedTimer = readTimerState();
  if (savedTimer && savedTimer.mode === TIMER_MODES.custom) return savedTimer;
  return createTimerState(TIMER_MODES.custom, 0);
}

const CustomTimer = ({ onNavigate, theme, isOffline }) => {
  const [timer, setTimer] = useState(createInitialTimer);
  const lastSessionId = useRef(timer.sessionId);
  const completionHandled = useRef(timer.state === 'completed');

  useEffect(() => {
    saveTimerState(timer);
  }, [timer]);

  useEffect(() => {
    if (timer.state !== 'running') return undefined;

    const nextBoundary = timer.deadlineAt - (timer.remainingSeconds - 1) * 1000;
    const timeout = window.setTimeout(() => {
      setTimer((current) => tickTimer(current));
    }, Math.max(0, nextBoundary - Date.now()));

    return () => window.clearTimeout(timeout);
  }, [timer]);

  useEffect(() => {
    if (lastSessionId.current !== timer.sessionId) {
      lastSessionId.current = timer.sessionId;
      completionHandled.current = false;
    }

    if (timer.state !== 'completed' || completionHandled.current) return;
    completionHandled.current = true;
    playCompletionSound();
  }, [timer.sessionId, timer.state]);

  const isSelected = timer.durationSeconds > 0;
  const isRunning = timer.state === 'running';
  const totalTime = timer.durationSeconds;
  const timeLeft = timer.remainingSeconds;
  const timerStatus = timer.state === 'completed'
    ? 'Brew timer complete.'
    : isRunning
      ? 'Brew timer running.'
      : timer.state === 'paused'
        ? 'Brew timer paused.'
        : isSelected
          ? 'Brew timer ready.'
          : 'Choose a brew duration.';

  const handleSelectTime = (minutes) => {
    const newTimer = createTimerState(TIMER_MODES.custom, minutes * 60);
    setTimer(startTimer(newTimer));
  };

  const handleStart = () => setTimer((current) => startTimer(current));
  const handlePause = () => setTimer((current) => pauseTimer(current));
  const handleReset = () => setTimer((current) => resetTimer(current));

  const handleCancel = () => {
    const cancelled = cancelTimer(timer);
    saveTimerState(cancelled);
    setTimer(cancelled);
  };

  return (
    <div className="card custom-card">
      <div className="top-bar">
        <button className="btn-back" type="button" onClick={() => onNavigate('home')} aria-label="Return to home screen">
          ← Back
        </button>
      </div>

      {isOffline && (
        <div className="offline-banner" role="status" aria-live="polite">
          Offline mode active — custom brew timer is saved on this device.
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">{timerStatus}</p>

      {!isSelected ? (
        <div className="time-selection-view">
          <h2 className="mode-title" style={{ color: 'var(--color-primary-dark)', fontSize: '2rem', marginBottom: '30px', fontWeight: 300, letterSpacing: '1px' }}>
            Select Brew Time ☕
          </h2>
          <div className="time-grid">
            {TIMES.map((minutes) => (
              <button
                key={minutes}
                className="btn time-btn"
                type="button"
                onClick={() => handleSelectTime(minutes)}
                aria-label={`Start a ${minutes} minute brew timer`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="brewing-view">
          <BrewingAnimation totalTime={totalTime} timeLeft={timeLeft} theme={theme} />

          <div
            className="time-display custom-timer-display"
            role="timer"
            aria-live="off"
            aria-label={`Remaining time ${formatTime(timeLeft)}`}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="custom-controls mt-30">
            {timer.state === 'completed' ? (
              <button className="btn" type="button" onClick={handleCancel} aria-label="Choose another brew duration">
                ← Brew Another
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button className="btn btn-secondary" type="button" onClick={handlePause} aria-label="Pause brew timer">
                    Pause
                  </button>
                ) : (
                  <button
                    className="btn"
                    type="button"
                    onClick={handleStart}
                    aria-label={timer.state === 'paused' ? 'Resume brew timer' : 'Start brew timer'}
                  >
                    {timer.state === 'paused' ? 'Resume' : 'Start'}
                  </button>
                )}
                <button className="btn btn-secondary" type="button" onClick={handleReset} aria-label="Reset brew timer to the selected duration">
                  Reset
                </button>
                <button className="btn btn-secondary" type="button" onClick={handleCancel} aria-label="Cancel brew timer and choose another duration">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimer;
