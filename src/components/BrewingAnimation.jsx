import React from 'react';
import { Canvas } from '@react-three/fiber';
import CoffeeCup3D from './CoffeeCup3D';
import { formatTime, getProgressRatio } from '../utils/timerState';

const BrewingAnimation = ({ totalTime, timeLeft, theme }) => {
  const p = getProgressRatio(timeLeft, totalTime);
  const progressPercent = p * 100;
  const isNight = theme === 'night';
  
  const getStatusText = (percent) => {
    if (percent >= 100) return "Your coffee is ready ☕";
    if (percent >= 80) return "Swirling latte foam...";
    if (percent >= 60) return "Mixing rich milk...";
    if (percent >= 40) return "Brewing espresso...";
    if (percent >= 20) return "Extracting flavors...";
    return "Heating water...";
  };

  const statusText = getStatusText(progressPercent);
  const isFinished = progressPercent >= 100;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '10px', fontWeight: 600, transition: 'color 1.5s ease' }}>{statusText}</h2>
      
      {!isFinished && <div style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', marginBottom: '20px', transition: 'color 1.5s ease' }}>{formatTime(timeLeft)} remaining</div>}

      <div style={{ width: '100%', height: '300px', position: 'relative' }}>
        <Canvas shadows camera={{ position: [0, 3, 6], fov: 45 }}>
          <ambientLight intensity={isNight ? 0.8 : 1.5} />
          <directionalLight position={[10, 10, 5]} intensity={isNight ? 0.5 : 1.5} color={isNight ? "#ffb366" : "#fff8e7"} castShadow />
          <CoffeeCup3D progress={p} theme={theme} />
        </Canvas>
      </div>

      <div style={{ width: '100%', height: '6px', background: 'rgba(56, 34, 15, 0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '20px' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-secondary), var(--color-primary-dark))', transition: 'width 1s linear' }}></div>
      </div>
    </div>
  );
};

export default BrewingAnimation;
