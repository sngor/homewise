// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "homewise-l57cg",
  appId: "1:1020422631301:web:fd2a776c1ba0fd08809eec",
  storageBucket: "homewise-l57cg.appspot.com",
  apiKey: "AIzaSyAYi3MIZeD_vHCJJDgDduIlSg7h5FrFDT4",
  authDomain: "homewise-l57cg.firebaseapp.com",
  messagingSenderId: "1020422631301"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
