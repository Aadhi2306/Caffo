import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app, auth, db, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.error("Firebase initialization warning (expected with placeholder config):", e);
}

export { auth, db };

export const loginWithGoogle = async () => {
  if (!auth) {
    alert("Firebase is not fully initialized. Provide real keys.");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    alert("Login failed or requires valid configuration.");
    throw error;
  }
};

export const logout = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const initializeUserProfile = async (uid) => {
  if (!db) return;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        totalFocusTime: 0,
        sessionsCompleted: 0,
        streakCount: 0,
        lastSessionDate: null
      });
    }
  } catch(e) { console.error(e); }
};

export const updateUserStats = async (uid, durationInSeconds) => {
  if (!db || !uid) return;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data();
      const today = new Date().toDateString();
      let newStreak = data.streakCount || 0;
      
      if (data.lastSessionDate) {
        if (data.lastSessionDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (data.lastSessionDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1; // broken streak
          }
        }
      } else {
        newStreak = 1;
      }

      await updateDoc(userRef, {
        totalFocusTime: increment(durationInSeconds),
        sessionsCompleted: increment(1),
        streakCount: newStreak,
        lastSessionDate: today
      });
    }
  } catch(e) { console.error("Could not update user stats", e); }
};

export const getUserStats = async (uid) => {
  if (!db || !uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch(e) {
    console.error(e);
    return null;
  }
};
