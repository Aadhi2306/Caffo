import React, { useState, useEffect } from 'react';
import './Mascot.css';

const Mascot = () => {
  const [mascotState, setMascotState] = useState('initial'); // 'initial', 'partial', 'peek', 'full'

  useEffect(() => {
    // On mount, wait 100ms then slide up to partial peek
    const initTimer = setTimeout(() => {
      setMascotState('peek'); // slide up more 
      
      setTimeout(() => {
         setMascotState('partial'); // settle into 20-30%
      }, 2000);
    }, 100);

    // Idle loop: every 6 seconds, do a peek
    const interval = setInterval(() => {
      setMascotState(prev => {
        if (prev === 'full') return prev;
        return 'peek';
      });
      
      setTimeout(() => {
        setMascotState(prev => {
          if (prev === 'full') return prev;
          return 'partial';
        });
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    setMascotState('full');
    setTimeout(() => {
      setMascotState('partial');
    }, 2000);
  };

  return (
    <div className={`mascot-container ${mascotState}`} onClick={handleClick}>
      <img src="/assets/mascot.png" alt="Cute Mascot" className="mascot-img" />
    </div>
  );
};

export default Mascot;
