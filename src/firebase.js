// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;
if (!firebaseConfigString) {
  throw new Error(
    "Firebase config not found in .env file. Please check your VITE_FIREBASE_CONFIG variable."
  );
}
const firebaseConfig = JSON.parse(firebaseConfigString);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Authentication Logic
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous sign-in failed", error);
    });
  }
});

export const getCurrentUser = () => currentUser;
