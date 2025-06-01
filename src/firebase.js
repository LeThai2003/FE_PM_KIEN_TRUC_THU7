// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "project-management-31aae.firebaseapp.com",
  projectId: "project-management-31aae",
  storageBucket: "project-management-31aae.firebasestorage.app",
  messagingSenderId: "883447892622",
  appId: "1:883447892622:web:9a20e9917826c6863217df"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);