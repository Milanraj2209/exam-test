const adminModule = require('firebase-admin');
const admin = adminModule.default || adminModule;
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

async function testDatabase() {
  console.log("1. Initializing Firebase Admin SDK...");
  
  try {
    if (!admin.apps || !admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines with actual newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
    console.log("✅ Successfully initialized Firebase Admin!");
    
    const db = admin.firestore();
    
    console.log("2. Attempting to write a test question to the database...");
    const testDoc = {
      text: "Is the database connected successfully?",
      options: ["Yes", "No", "Maybe", "I don't know"],
      correctAnswer: "Yes",
      subject: "System Test",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('questions').add(testDoc);
    console.log(`✅ Successfully wrote to database! Document ID: ${docRef.id}`);
    
    console.log("3. Attempting to read from the database...");
    const snapshot = await db.collection('questions').doc(docRef.id).get();
    
    if (snapshot.exists) {
      console.log("✅ Successfully read the document back from the database!");
      console.log("Document data:", snapshot.data());
      
      console.log("4. Cleaning up test data...");
      await db.collection('questions').doc(docRef.id).delete();
      console.log("✅ Test data cleaned up successfully!");
      console.log("\n🎉 ALL TESTS PASSED! FIREBASE IS WORKING PERFECTLY! 🎉");
    } else {
      console.log("❌ Failed to read the document back.");
    }
    
  } catch (error) {
    console.error("❌ ERROR DURING TEST:", error);
  }
}

testDatabase();
