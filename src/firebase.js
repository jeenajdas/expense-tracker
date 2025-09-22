// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFWyaygMS4qPDe2NPNAvK08VgfD9y1RDI",
  authDomain: "expense-tracker-bce9c.firebaseapp.com",
  projectId: "expense-tracker-bce9c",
  storageBucket: "expense-tracker-bce9c.firebasestorage.app",
  messagingSenderId: "146537408855",
  appId: "1:146537408855:web:3a34c3e679517dc9ff3612",
  measurementId: "G-MY3X94DE8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Export services to use
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);