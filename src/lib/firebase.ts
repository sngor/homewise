
// This file is not currently used while the app is in local session mode.
// You can re-enable Firebase integration by uncommenting the code and
// updating the data functions in `src/lib/data.ts`.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { config } from 'dotenv';

config();

const firebaseConfig = {
  "projectId": "homewise-l57cg",
  "appId": "1:1020422631301:web:fd2a776c1ba0fd08809eec",
  "storageBucket": "homewise-l57cg.firebasestorage.app",
  "apiKey": "AIzaSyAYi3MIZeD_vHCJJDgDduIlSg7h5FrFDT4",
  "authDomain": "homewise-l57cg.firebaseapp.com",
  "messagingSenderId": "1020422631301"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export { app, db, storage, auth, googleProvider };
