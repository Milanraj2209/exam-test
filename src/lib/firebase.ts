const adminModule = require('firebase-admin');
const admin = adminModule.default || adminModule;

// Initialize Firebase Admin SDK
if (admin && admin.apps && !admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin initialized successfully in Next.js.");
    } else {
      console.warn("Firebase credentials missing. Falling back to local data/questions.json (NOT PERSISTENT IN PRODUCTION)");
    }
  } catch (error) {
    console.error("Firebase initialization error", error);
  }
}

export const db = (admin && admin.apps && admin.apps.length) ? admin.firestore() : null;
