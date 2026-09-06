import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC1QkHFU5HSN-CD7iCeWl5GmDiAK1RS2FA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "evacnow-demow.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://evacnow-demow-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "evacnow-demow",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "evacnow-demow.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161545703268",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:161545703268:web:a716e00bde6f182cf87471"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
