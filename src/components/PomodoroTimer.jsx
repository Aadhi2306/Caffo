import React, { useEffect, useRef, useState } from 'react';
import { auth, updateUserStats } from '../firebase';
import {
  cancelTimer,
  createTimerState,
  formatTime,
  getModeLabel,
  getProgressRatio,
  pauseTimer,
  playCompletionSound,
  readTimerState,
  resetTimer,
  saveTimerState,
  startTimer,
  tickTimer,
  TIMER_MODES,
} from '../utils/timerState';
import './PomodoroTimer.css';

const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 10 * 60;

function createInitialState() {
  const savedTimer = readTimerState();
  const timer = savedTimer && savedTimer.mode !== TIMER_MODES.custom
    ? savedTimer
    : createTimerState(TIMER_MODES.work, WORK_TIME);

  return {
    timer,
    restoredBreakCompletion: Boolean(
      savedTimer &&
      savedTimer.state === 'completed' &&
      [TIMER_MODES.shortBreak, TIMER_MODES.longBreak].includes(savedTimer.mode),
    ),
  };
}

const PomodoroTimer = ({ onNavigate, isOffline }) => {
  const [initialState] = useState(createInitialState);
  const [timer, setTimer] = useState(initialState.timer);
  const restoredBreakCompletion = useRef(initialState.restoredBreakCompletion);
  const lastSessionId = useRef(timer.sessionId);
  const completionHandled = useRef(timer.state === 'completed');
  const dialogRef = useRef(null);
  const timerDisplayRef = useRef(null);
  const wasCompletionDialogOpen = useRef(false);
  const isBreakCompletion = [TIMER_MODES.shortBreak, TIMER_MODES.longBreak].includes(timer.mode);
  const completionDialogOpen = timer.state === 'completed' && (
    timer.mode === TIMER_MODES.work ||
    (isBreakCompletion && restoredBreakCompletion.current)
  );

  useEffect(() => {
    if (completionDialogOpen) {
      wasCompletionDialogOpen.current = true;
      dialogRef.current?.querySelector('button')?.focus();
      return;
    }

    if (wasCompletionDialogOpen.current) {
      wasCompletionDialogOpen.current = false;
      timerDisplayRef.current?.focus();
    }
  }, [completionDialogOpen]);

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

    if (timer.mode === TIMER_MODES.work) {
      playCompletionSound();
      if (auth && auth.currentUser) {
        updateUserStats(auth.currentUser.uid, WORK_TIME).catch((error) => {
          console.error('Firebase update error', error);
        });
      }
    } else if (!restoredBreakCompletion.current) {
      setTimer(startTimer(createTimerState(TIMER_MODES.work, WORK_TIME)));
    }
  }, [timer.mode, timer.sessionId, timer.state]);

  const mode = timer.mode;
  const timeLeft = timer.remainingSeconds;
  const isRunning = timer.state === 'running';
  const totalTime = timer.durationSeconds || WORK_TIME;
  const circumference = 2 * Math.PI * 130;
  const strokeDashoffset = circumference * getProgressRatio(timeLeft, totalTime);
  const timerStatus = timer.state === 'completed'
    ? 'Timer complete.'
    : isRunning
      ? `${getModeLabel(mode)} timer running.`
      : timer.state === 'paused'
        ? `${getModeLabel(mode)} timer paused.`
        : `${getModeLabel(mode)} timer ready.`;

  const handleStart = () => setTimer((current) => startTimer(current));
  const handlePause = () => setTimer((current) => pauseTimer(current));
  const handleReset = () => setTimer((current) => resetTimer(current));

  const handleCancel = () => {
    restoredBreakCompletion.current = false;
    const cancelled = cancelTimer(timer);
    saveTimerState(cancelled);
    setTimer(cancelled);
    onNavigate('home');
  };

  const startWork = () => {
    restoredBreakCompletion.current = false;
    setTimer(startTimer(createTimerState(TIMER_MODES.work, WORK_TIME)));
  };

  const startBreak = (duration) => {
    const breakMode = duration === SHORT_BREAK
      ? TIMER_MODES.shortBreak
      : TIMER_MODES.longBreak;
    setTimer(startTimer(createTimerState(breakMode, duration)));
  };

  return (
    <div className="card pomodoro-card">
      <div className="top-bar">
        <button
          className="btn-back"
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Return to home screen"
        >
          ← Back
        </button>
      </div>

      {isOffline && (
        <div className="offline-banner" role="status" aria-live="polite">
          Offline mode active — timer continues locally and is saved on this device.
        </div>
      )}

      <h2 className="mode-title">{getModeLabel(mode)}</h2>

      <div className={`timer-ring-container ${isRunning ? 'active-glow' : ''}`}>
        <svg className="timer-svg" width="300" height="300" viewBox="0 0 300 300" aria-hidden="true">
          <circle cx="150" cy="150" r="130" stroke="rgba(255,255,255,0.4)" strokeWidth="4" fill="none" />
          <circle
            cx="150"
            cy="150"
            r="130"
            stroke="var(--color-primary)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 150 150)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div
          className="time-display"
          role="timer"
          aria-live="off"
          tabIndex="-1"
          aria-label={`Remaining time ${formatTime(timeLeft)}`}
          ref={timerDisplayRef}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">{timerStatus}</p>

      <div className="controls">
        {isRunning ? (
          <button className="btn btn-secondary" type="button" onClick={handlePause} aria-label="Pause timer">
            Pause
          </button>
        ) : (
          <button
            className="btn"
            type="button"
            onClick={handleStart}
            aria-label={timer.state === 'paused' ? 'Resume timer' : 'Start timer'}
          >
            {timer.state === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button className="btn btn-secondary" type="button" onClick={handleReset} aria-label="Reset timer to the starting duration">
          Reset
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleCancel} aria-label="Cancel timer and return home">
          Cancel
        </button>
      </div>

      {completionDialogOpen && (
        <div className="popup-overlay">
          <div
            className="popup-glass"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="timer-complete-title"
            aria-describedby="timer-complete-description"
            onKeyDown={(event) => {
              if (event.key !== 'Tab') return;
              const buttons = dialogRef.current?.querySelectorAll('button:not([disabled])');
              if (!buttons?.length) return;
              const firstButton = buttons[0];
              const lastButton = buttons[buttons.length - 1];

              if (event.shiftKey && document.activeElement === firstButton) {
                event.preventDefault();
                lastButton.focus();
              } else if (!event.shiftKey && document.activeElement === lastButton) {
                event.preventDefault();
                firstButton.focus();
              }
            }}
          >
            <h3 id="timer-complete-title">
              {isBreakCompletion ? 'Break Complete ✨' : 'Focus Complete ✨'}
            </h3>
            <p id="timer-complete-description">
              {isBreakCompletion
                ? 'Your focus session is ready when you are.'
                : 'Time for a fresh brew?'}
            </p>
            <div className="popup-buttons">
              {isBreakCompletion ? (
                <>
                  <button className="btn" type="button" onClick={startWork} aria-label="Start focus session">
                    Start Focus
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={handleCancel} aria-label="Return home after the break">
                    Return Home
                  </button>
                </>
              ) : (
                <>
                  <button className="btn" type="button" onClick={() => startBreak(SHORT_BREAK)} aria-label="Take a short break">
                    Short Break
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => startBreak(LONG_BREAK)} aria-label="Take a long break">
                    Long Break
                  </button>
                  <button className="btn btn-secondary" type="button" style={{ background: 'transparent', boxShadow: 'none' }} onClick={startWork} aria-label="Skip the break and start work again">
                    Skip
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
