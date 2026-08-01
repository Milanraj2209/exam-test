import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAf2PQPHplwUeYbrtGJVus7T0YV8yYN_9Q",
  authDomain: "exam-test-d44da.firebaseapp.com",
  projectId: "exam-test-d44da",
  storageBucket: "exam-test-d44da.firebasestorage.app",
  messagingSenderId: "164880622089",
  appId: "1:164880622089:web:b83c03101c6892dfa64ed8",
  measurementId: "G-XPY61E4CH9"
};

// Initialize Firebase safely in Next.js (avoids re-initialization errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics only if supported (it requires a browser environment)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

import { getAuth } from "firebase/auth";

export const auth = getAuth(app);
export { app, analytics };
