// This file is not currently used while the app is in local session mode.
// You can re-enable Firebase integration by uncommenting the code and
// updating the data functions in `src/lib/data.ts`.

/*
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { config } from 'dotenv';

config();

const firebaseConfig = {
  projectId: "homewise-l57cg",
  appId: "1:1020422631301:web:fd2a776c1ba0fd08809eec",
  storageBucket: "homewise-l57cg.appspot.com",
  apiKey: "YOUR_API_KEY", // Replace with your actual API key if you re-enable
  authDomain: "homewise-l57cg.firebaseapp.com",
  messagingSenderId: "1020422631301"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
*/
export {}; // To make this a valid module while commented out.
