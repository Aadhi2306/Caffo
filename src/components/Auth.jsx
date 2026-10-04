import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logout, getUserStats, initializeUserProfile } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Auth.css';

const Auth = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await initializeUserProfile(currentUser.uid);
          const userStats = await getUserStats(currentUser.uid);
          setStats(userStats);
        } catch (e) {
          console.error("Auth listener error", e);
        }
      } else {
        setStats(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
     let interval;
     // Soft poll to update stats locally when dropdown is open
     if (user && showDropdown) {
       interval = setInterval(async () => {
         const userStats = await getUserStats(user.uid);
         setStats(userStats);
       }, 4000);
     }
     return () => clearInterval(interval);
  }, [user, showDropdown]);

  if (!user) {
    return (
      <div className="auth-container">
        <button className="btn-auth login-btn" onClick={loginWithGoogle}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
        <img src={user.photoURL || 'https://via.placeholder.com/45'} alt="Profile" className="profile-pic" />
      </div>
      
      {showDropdown && (
        <div className="auth-dropdown card">
          <div className="user-info">
            <span className="user-name">{user.displayName}</span>
            <span className="user-email">{user.email}</span>
          </div>
          
          {stats ? (
            <div className="user-stats">
              <div className="stat-item">
                <span>🔥 Streak:</span>
                <strong>{stats.streakCount} days</strong>
              </div>
              <div className="stat-item">
                <span>✅ Sessions:</span>
                <strong>{stats.sessionsCompleted}</strong>
              </div>
              <div className="stat-item">
                <span>⏱️ Focus T.:</span>
                <strong>{Math.floor(stats.totalFocusTime / 60)} mins</strong>
              </div>
            </div>
          ) : (
            <div className="user-stats text-light">Loading stats...</div>
          )}

          <button className="btn-auth logout-btn" onClick={() => { logout(); setShowDropdown(false); }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
