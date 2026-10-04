import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CoffeeCup3D from './CoffeeCup3D';
import './Home.css';

const Home = ({ onNavigate, theme, isOffline }) => {
  const [hovering, setHovering] = useState(false);
  const isNight = theme === 'night';

  return (
    <div className="home card">
      <h1 className="title">Coffee Timer ☕</h1>
      <p className="subtitle">Focus your mind. Brew your best.</p>

      {isOffline && (
        <p className="offline-note" role="status" aria-live="polite">
          Offline mode is active. Your timer continues locally.
        </p>
      )}
      
      <div 
        className="hero-cup-container glow-pulse"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        role="button"
        tabIndex={0}
        aria-label="Open focus timer"
        onClick={() => onNavigate('pomodoro')}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigate('pomodoro');
          }
        }}
      >
        <Canvas shadows camera={{ position: [0, 2, 7], fov: 45 }}>
          <ambientLight intensity={isNight ? 0.8 : 1.5} />
          <directionalLight position={[10, 10, 5]} intensity={isNight ? 0.5 : 1.5} color={isNight ? "#ffb366" : "#fff8e7"} castShadow />
          <CoffeeCup3D progress={1} isHovering={hovering} theme={theme} />
        </Canvas>
      </div>
      
      <div className="buttons-container">
        <button
          className="btn"
          type="button"
          onClick={() => onNavigate('pomodoro')}
          aria-label="Start a Pomodoro focus timer"
        >
          Pomodoro Focus
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => onNavigate('custom')}
          aria-label="Start a custom brew timer"
        >
          Custom Brew Timer
        </button>
      </div>

    </div>
  );
};

export default Home;
