import React, { useState, useEffect, useRef } from 'react';
import Home from './components/Home';
import PomodoroTimer from './components/PomodoroTimer';
import CustomTimer from './components/CustomTimer';
import Background3D from './components/Background3D';
import Mascot from './components/Mascot';
import { readTimerState, TIMER_MODES } from './utils/timerState';

function getInitialView() {
  const savedTimer = readTimerState();
  if (!savedTimer || savedTimer.state === 'idle') return 'home';
  return savedTimer.mode === TIMER_MODES.custom ? 'custom' : 'pomodoro';
}

function App() {
  const [currentView, setCurrentView] = useState(getInitialView);
  const [theme, setTheme] = useState('day');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.className = theme === 'night' ? 'night-mode' : 'day-mode';
  }, [theme]);

  useEffect(() => {
    const handleNetworkChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e); 
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) {
      // Look for a local file named lofi.mp3 in the public/assets folder
      audioRef.current = new Audio('/assets/lofi.mp3'); 
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }

    if (!audioEnabled) {
      audioRef.current.play().catch(console.error);
      let vol = 0;
      const fade = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.4) { clearInterval(fade); audioRef.current.volume = 0.4; }
        else { audioRef.current.volume = vol; }
      }, 100);
      setAudioEnabled(true);
    } else {
      let vol = audioRef.current.volume;
      const fade = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) { clearInterval(fade); audioRef.current.pause(); }
        else { audioRef.current.volume = Math.max(0, vol); }
      }, 100);
      setAudioEnabled(false);
    }
  };

  const toggleTheme = () => setTheme(t => t === 'day' ? 'night' : 'day');

  return (
    <div className={`app-container`}>
      <Background3D theme={theme} />
      
      <div className="global-controls">
        {deferredPrompt && (
          <button
            className="install-btn"
            type="button"
            onClick={handleInstallClick}
            title="Install App"
            aria-label="Install Brewly app"
          >
            📱 Install Brewly
          </button>
        )}
        <button
          className="icon-btn"
          type="button"
          onClick={toggleTheme}
          title="Toggle Day/Night"
          aria-label={theme === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
          aria-pressed={theme === 'night'}
        >
          {theme === 'day' ? '🌙' : '☀️'}
        </button>
        <button
          className="icon-btn"
          type="button"
          onClick={toggleAudio}
          title="Toggle Ambient Café Audio"
          aria-label={audioEnabled ? 'Mute ambient café audio' : 'Turn on ambient café audio'}
          aria-pressed={audioEnabled}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {isOffline && (
        <div className="offline-banner" role="status" aria-live="polite">
          Offline mode: the timer keeps running locally.
        </div>
      )}

      {currentView === 'home' && <Home onNavigate={setCurrentView} theme={theme} isOffline={isOffline} />}
      {currentView === 'pomodoro' && <PomodoroTimer onNavigate={setCurrentView} theme={theme} isOffline={isOffline} />}
      {currentView === 'custom' && <CustomTimer onNavigate={setCurrentView} theme={theme} isOffline={isOffline} />}
      
      <Mascot />
    </div>
  );
}

export default App;
